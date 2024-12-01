import {ChangeEvent, FocusEvent, MouseEvent, useState} from "react";
import Validation from "../../../../validation/validation.ts";
import Styled from "./Signin.styled";
import {Button, IconButton, InputAdornment, TextField, Typography} from "@mui/material";
import Form from "@components/Form/Form.tsx";
import {useNavigate} from "react-router-dom";
import {Path} from "../../../../main.tsx";
import LoginBackground from '../../../../assets/images/Login.jpg';
import {useMutation} from "@tanstack/react-query";
import AuthService from "../../../../services/AuthService/Auth.service.ts";
import {useDispatch} from "react-redux";
import {setUser, User} from "../../../../reducer/user.reducer.ts";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {Autoplay, Keyboard, Mousewheel, Pagination, Parallax} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Box from "@mui/material/Box";
import UserService from "../../../../services/UserService/User.service.ts";


const Signin = () => {
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
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const [isRegisterView, setRegisterView] = useState<boolean>(false)

  const sendLogin = useMutation({
    mutationFn: AuthService().login,
    onError: (error) => {
      console.log(error);
      setIsAlertVisible(true)
    },
    onSuccess: (data) => {
      dispatch(setUser(data.data.user as User));
      navigate(Path.HOME);
    }
  });

  const sendRegister = useMutation({
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

  const [form, setForm] = useState<Record<InputName, typeof INITIAL_VALIDATION_OBJECT>>({
    [InputName.EMAIL]: INITIAL_VALIDATION_OBJECT,
    [InputName.PASSWORD]: INITIAL_VALIDATION_OBJECT,
  });

  const SignInValidation = {
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
    },
  }

  const isFormValid = Object.values(form).every((input) => input.isValid);

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    setForm({
      ...form,
      [name]: SignInValidation[name as InputName](value),
    })
  }

  const onSubmitForm = (event: MouseEvent<HTMLButtonElement>) => {
    if (!isFormValid) return;
    event.preventDefault();
    const formData = Object.entries(form).reduce((acc, [key, input]) => {
      acc[key as InputName] = input.value;
      return acc;
    }, {} as Record<InputName, string>);


    isRegisterView ?
      sendRegister.mutate({
        ...formData,
        loginAfterCreate: true,
      }) : sendLogin.mutate(formData)
  }

  const onInputBlur = (e: FocusEvent<HTMLInputElement>) => {
    const name = e.target.name as InputName;
    const newValue = SignInValidation[name](form[name].value);
    setForm({
      ...form,
      [name]: {
        ...newValue,
        isDirty: true,
      }
    })
  }

  const onInputFocus = (e: FocusEvent<HTMLInputElement>) => {
    const name = e.target.name as InputName;
    const newValue = SignInValidation[name](e.target.value);
    setForm({
      ...form,
      [name]: {
        ...newValue,
      }
    })
  }


  const handleOnClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    Object.entries(form).forEach(([identifier, field]) => {
      const newValue = SignInValidation[identifier as InputName](field.value);

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

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleClickShowPassword = () => setShowPassword(prevState => !prevState);

  const handleMouseDownPassword = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleChangeFormView = () => setRegisterView((prevState) => !prevState);

  return (
    <>
      <Styled.LoginRoot>
        <Styled.Background src={LoginBackground}/>
        <Styled.LoginBox>
          <Styled.LoginWrapper>
            {isAlertVisible && (
              <Styled.Alert variant={"outlined"}
                            severity={"error"}
              >
                This is an outlined info Alert.
              </Styled.Alert>
            )}
            <Box>
              <img src="https://dummyimage.com/100x30"
                   alt="logo"
                   width="100px"
                   height="30px"
              />
              <span>Logo</span>
            </Box>
            <div>
              <Typography variant={'h3'}>{isRegisterView ? 'Register' : 'Sign in!'}</Typography>
              <Typography variant={'subtitle1'}>
                {isRegisterView ? `Create Plan, and track progress of your drams. Set account and turn into your azimuth` : `Your Dream, Your Plan. Login and set your azimuth.`}
              </Typography>
            </div>
            <Form autoComplete={"on"}
                  action={''}
            >
              {/*<FormControl>*/}
              <TextField type="email"
                         variant={'outlined'}
                         label="Email"
                         autoFocus
                         name={InputName.EMAIL}
                         onChange={onChangeInput}
                         onBlur={onInputBlur}
                         onFocus={onInputFocus}
                         placeholder="Email"
                         autoComplete="username"
                         error={form.email.isDirty && !!form.email.error}
                         helperText={form.email.isDirty && form.email.error}
              />
              <TextField variant={'outlined'}
                         label="Password"
                         name={InputName.PASSWORD}
                         onChange={onChangeInput}
                         onBlur={onInputBlur}
                         onFocus={onInputFocus}
                         placeholder="Password"
                         value={form.password.value}
                         autoComplete={isRegisterView ? 'new-password' : 'current-password'}
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
                                 {showPassword ? <VisibilityOff/> : <Visibility/>}
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
                {isRegisterView ? 'Register' : 'Login'}
              </Button>
            </Form>
            <span>
              {isRegisterView ? 'Already have an account?' : `Don't have an account?`}
              {' '}
              {/*Style it as link */}
              <span onClick={handleChangeFormView}>
                {isRegisterView ? 'Login' : 'Register'}
              </span>
            </span>
          </Styled.LoginWrapper>
        </Styled.LoginBox>
        <Styled.Feathers>
          <Swiper modules={[Autoplay, Mousewheel, Pagination, Parallax, Keyboard]}
                  slidesPerView={1}
                  parallax={true}
                  speed={600}
                  keyboard={{
                    enabled: true,
                  }}
                  loop={true}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true
                  }}
                  mousewheel
                  className="mySwiper"
                  autoplay={{
                    delay: 5000,
                  }}
          >
            <div slot="container-start"
                 className="parallax-bg"
                 data-swiper-parallax="-23%"
            >
            </div>
            <SwiperSlide>
              <div className="title"
                   data-swiper-parallax="-300"
              >
                Slide 1
              </div>
              <div className="subtitle"
                   data-swiper-parallax="-200"
              >
                Subtitle
              </div>
              <div className="text"
                   data-swiper-parallax="-100"
              >
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                  dictum mattis velit, sit amet faucibus felis iaculis nec. Nulla
                  laoreet justo vitae porttitor porttitor. Suspendisse in sem justo.
                  Integer laoreet magna nec elit suscipit, ac laoreet nibh euismod.
                  Aliquam hendrerit lorem at elit facilisis rutrum. Ut at
                  ullamcorper velit. Nulla ligula nisi, imperdiet ut lacinia nec,
                  tincidunt ut libero. Aenean feugiat non eros quis feugiat.
                </p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="title"
                   data-swiper-parallax="-300"
              >
                Slide 2
              </div>
              <div className="subtitle"
                   data-swiper-parallax="-200"
              >
                Subtitle
              </div>
              <div className="text"
                   data-swiper-parallax="-100"
              >
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                  dictum mattis velit, sit amet faucibus felis iaculis nec. Nulla
                  laoreet justo vitae porttitor porttitor. Suspendisse in sem justo.
                  Integer laoreet magna nec elit suscipit, ac laoreet nibh euismod.
                  Aliquam hendrerit lorem at elit facilisis rutrum. Ut at
                  ullamcorper velit. Nulla ligula nisi, imperdiet ut lacinia nec,
                  tincidunt ut libero. Aenean feugiat non eros quis feugiat.
                </p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="title"
                   data-swiper-parallax="-300"
              >
                Slide 3
              </div>
              <div className="subtitle"
                   data-swiper-parallax="-200"
              >
                Subtitle
              </div>
              <div className="text"
                   data-swiper-parallax="-100"
              >
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                  dictum mattis velit, sit amet faucibus felis iaculis nec. Nulla
                  laoreet justo vitae porttitor porttitor. Suspendisse in sem justo.
                  Integer laoreet magna nec elit suscipit, ac laoreet nibh euismod.
                  Aliquam hendrerit lorem at elit facilisis rutrum. Ut at
                  ullamcorper velit. Nulla ligula nisi, imperdiet ut lacinia nec,
                  tincidunt ut libero. Aenean feugiat non eros quis feugiat.
                </p>
              </div>
            </SwiperSlide>
          </Swiper>
        </Styled.Feathers>
      </Styled.LoginRoot>
    </>
  );
};

export default Signin;
