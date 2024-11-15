import {ChangeEvent, FocusEvent, MouseEvent, useState} from "react";
import Validation from "../../../../validation/validation.ts";
import Styled from "./Login.styled";
import {Button, IconButton, InputAdornment, TextField, Typography} from "@mui/material";
import Form from "@components/Form/Form.tsx";
import {Link, useNavigate} from "react-router-dom";
import {Path} from "../../../../main.tsx";
import LoginBackground from '../../../../assets/images/Login.jpg';
import {useMutation} from "@tanstack/react-query";
import AuthService from "../../../../services/AuthService/Auth.service.ts";
import {useDispatch} from "react-redux";
import {setUser, User} from "../../../../reducer/user.reducer.ts";
import {Visibility, VisibilityOff} from "@mui/icons-material";

const Login = () => {
  enum InputName {
    EMAIL = 'email',
    PASSWORD = 'password',
  }

  const INITIAL_VALIDATION_OBJECT = {
    isValid: false,
    error: '',
    value: '',
    isDirty: false,
  }
  // const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationFn: AuthService().login,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      dispatch(setUser(data.data.user as User));
      navigate(Path.HOME);
    }
  });

  const [form , setForm] = useState({
    email: INITIAL_VALIDATION_OBJECT,
    password: INITIAL_VALIDATION_OBJECT
  })

  const formValidation = {
    [InputName.EMAIL]: (value: string) => {
      return new Validation(value)
        .isRequired()
        .isEmail()
    },
    [InputName.PASSWORD]: (value: string) => {
      return new Validation(value)
        .isRequired()
        .hasMinLength(6)
        .hasMaxLength(20);
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
    });
  }

  const onInputBlur = (e?: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
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

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

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
            <Typography variant={'h3'}>Sign in!</Typography>
            <Typography variant={'subtitle1'}>Your Dream, Your Plan. Login and set your azimuth.</Typography>
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
                       type={showPassword ? 'text' : 'password'}
                       InputProps={{
                         endAdornment: (
                           <InputAdornment position="end">
                             <IconButton aria-label="toggle password visibility"
                                         onClick={handleClickShowPassword}
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
              Login
            </Button>
          </Form>
          <span>
            Don't have an account?
            {' '}
            <Link to={Path.REGISTER}>Register</Link>
          </span>
        </Styled.LoginBox>
        <Styled.Feathers sx={{display: {xs: 'none', md: 'block'}}} />
      </Styled.LoginRoot>
    </>
  );
};

export default Login;
