import {ChangeEvent, FocusEvent, MouseEvent, useEffect, useState} from "react";
import Validation from "../../../../validation/validation.ts";
import Styled from "./Register.styled.ts";
import {Button, IconButton, InputAdornment, TextField, Typography} from "@mui/material";
import Form from "@components/Form/Form.tsx";
import {Link, useNavigate} from "react-router-dom";
import {Path} from "../../../../main.tsx";
import LoginBackground from '../../../../assets/images/Login.jpg';
import {useMutation} from "@tanstack/react-query";
import {useDispatch} from "react-redux";
import {setUser, User} from "../../../../reducer/user.reducer.ts";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import UserService from "../../../../services/UserService/User.service.ts";

const Login = () => {
  enum InputName {
    EMAIL = 'email',
    PASSWORD = 'password',
    PASSWORD_CONFIRMATION = 'passwordConfirmation',
  }

  interface ValidationResult {
    isValid: boolean;
    error: string;
    value: string;
    isDirty: boolean;
  }

  const INITIAL_VALIDATION_OBJECT: ValidationResult  = {
    isValid: false,
    error: '',
    value: '',
    isDirty: false,
  }

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationFn: UserService().createUser,
    onError: (error) => {
      // TODO: handle errors, maybe show a snackbar
      console.log(error);
    },
    onSuccess: (data) => {
      dispatch(setUser(data.data.user as User));
      navigate(Path.HOME);
    }
  });

  const [form , setForm] = useState<Record<InputName, ValidationResult>>({
    [InputName.EMAIL]: INITIAL_VALIDATION_OBJECT,
    [InputName.PASSWORD]: INITIAL_VALIDATION_OBJECT,
    [InputName.PASSWORD_CONFIRMATION]: INITIAL_VALIDATION_OBJECT
  })

  const passwordsAreEqual = (password: string, repeatedPassword: string) => password === repeatedPassword;

  const formValidation: Record<InputName, (value: string) => Validation<string>> = {
    [InputName.EMAIL]: (value: string) => {
      return new Validation(value)
        .isRequired()
        .isEmail()
    },
    [InputName.PASSWORD]: (value: string) => {
      return new Validation(value)
        .isRequired()
        .hasMinLength(6)
        .hasMaxLength(20)
        .customCheck(() => passwordsAreEqual(value, form.passwordConfirmation.value), 'Passwords do not match');
    },
    [InputName.PASSWORD_CONFIRMATION]: (value: string) => {
      return new Validation(value)
        .isRequired()
        .hasMinLength(6)
        .hasMaxLength(20)
        .customCheck(() => passwordsAreEqual(value, form.password.value), 'Passwords do not match');
    }
  }

  const isFormValid = Object.values(form).every((input) => input.isValid)

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name  , value } = e.target;
    const newValue = formValidation[name as InputName](value);

    setForm({
      ...form,
      [name]: newValue
    })
  }

  const onSubmitForm = (event: MouseEvent<HTMLButtonElement>) => {
    if (!isFormValid) return;
    event.preventDefault();
    mutation.mutate({
      email: form.email.value,
      password: form.password.value,
      passwordConfirmation: form.passwordConfirmation.value,
      loginAfterCreate: true,
    });
  }

  const onInputBlur = (e?: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!e?.target?.name) return;
    const name = e?.target?.name as InputName;
    const newValue = formValidation[name](form[name].value);
    setForm({
      ...form,
      [name]: {
        ...newValue,
        isDirty: true,
      }
    })
  }

  const handleOnClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    Object.entries(form).forEach(([identifier, field ]) => {
      const newValue = formValidation[identifier as InputName](field.value);
      setForm({
        ...form,
        [identifier]: {
          ...newValue,
          isDirty: true,
        }
      })
    })
    onSubmitForm(event)
  }

  const [showPassword, setShowPassword] = useState<Record<Exclude<InputName, InputName.EMAIL>, boolean>>({
    [InputName.PASSWORD]: false,
    [InputName.PASSWORD_CONFIRMATION]: false
  });

  const handleClickShowPassword = (inputName: Exclude<InputName, InputName.EMAIL> ) => {
    setShowPassword(prevState => ({
      ...prevState,
      [inputName]: !prevState[inputName]
    }));
  };

  const handleMouseDownPassword = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (form[InputName.PASSWORD].isValid && form[InputName.PASSWORD_CONFIRMATION].isDirty) {
      const newValue = formValidation[InputName.PASSWORD_CONFIRMATION](form.passwordConfirmation.value) as ValidationResult;
      setForm({
        ...form,
        [InputName.PASSWORD_CONFIRMATION]: {
          ...newValue,
          isDirty: true,
        }
      })
    }
    if (form[InputName.PASSWORD_CONFIRMATION].isValid && form[InputName.PASSWORD].isDirty) {
      const newValue = formValidation[InputName.PASSWORD](form.password.value) as ValidationResult;
      setForm({
        ...form,
        [InputName.PASSWORD]: {
          ...newValue,
          isDirty: true,
        }
      })
    }
  }, [form[InputName.PASSWORD].value, form[InputName.PASSWORD_CONFIRMATION].value])

  return (
    <>
      <Styled.LoginRoot>
        <Styled.Background src={LoginBackground} />
        <Styled.LoginBox>
          <div>
            <img src=""
                 alt="logo"
            />
            <span>Logo</span>
          </div>
          <div>
            <Typography variant={'h3'}>Register</Typography>
            <Typography variant={'subtitle1'}>Create Plan, and track progress of your drams. Set account and turn into your azimuth.</Typography>
          </div>
          <Form autoComplete={"on"}>
            <TextField type="email"
                       variant={'outlined'}
                       label="Email"
                       name={InputName.EMAIL}
                       onChange={onChangeInput}
                       onBlur={onInputBlur}
                       placeholder="Email"
                       error={form.email.isDirty && !!form.email.error}
                       helperText={form.email.isDirty && form.email.error}
            />
            <TextField variant={'outlined'}
                       label="Password"
                       name={InputName.PASSWORD}
                       onChange={onChangeInput}
                       onBlur={onInputBlur}
                       placeholder="Password"
                       value={form.password.value}
                       error={form.password.isDirty && !!form.password.error}
                       helperText={form.password.isDirty && form.password.error}
                       type={showPassword[InputName.PASSWORD] ? 'text' : 'password'}
                       InputProps={{
                         endAdornment: (
                           <InputAdornment position="end">
                             <IconButton aria-label="toggle password visibility"
                                         onClick={() => handleClickShowPassword(InputName.PASSWORD)}
                                         onMouseDown={handleMouseDownPassword}
                             >
                               {showPassword ? <VisibilityOff /> : <Visibility />}
                             </IconButton>
                           </InputAdornment>
                         ),
                       }}
            />
            <TextField variant={'outlined'}
                       label="Confirm password"
                       name={InputName.PASSWORD_CONFIRMATION}
                       onChange={onChangeInput}
                       onBlur={onInputBlur}
                       placeholder="Password confirmation"
                       value={form.passwordConfirmation.value}
                       error={form.passwordConfirmation.isDirty && !!form.passwordConfirmation.error}
                       helperText={form.passwordConfirmation.isDirty && form.passwordConfirmation.error}
                       type={showPassword[InputName.PASSWORD_CONFIRMATION] ? 'text' : 'password'}
                       InputProps={{
                         endAdornment: (
                           <InputAdornment position="end">
                             <IconButton aria-label="toggle password visibility"
                                         onClick={() => handleClickShowPassword(InputName.PASSWORD_CONFIRMATION)}
                                         onMouseDown={handleMouseDownPassword}
                             >
                               {showPassword ? <VisibilityOff /> : <Visibility />}
                             </IconButton>
                           </InputAdornment>
                         ),
                       }}
            />
            <Button variant={'contained'}
                    type={'submit'}
                    disabled={!isFormValid}
                    onClick={handleOnClick}
            >
              Register
            </Button>
          </Form>
          <span>
            Already have an account?
            {' '}
            <Link to={Path.LOGIN}>Login</Link>
          </span>
        </Styled.LoginBox>
        <Styled.Feathers sx={{display: {xs: 'none', md: 'block'}}} />
      </Styled.LoginRoot>
    </>
  );
};

export default Login;
