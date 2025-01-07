import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import "./AdminLogin.scss";
import FormValidation from "@App/admin/pages/validation/FormValidation";
import InputText from "@App/admin/components/common/ctrls/InputText";
import Api from "../../api/Api";
import { useSnackbar } from "notistack";
import { Link, useNavigate, useLocation } from "react-router-dom";
import userSessionInfo from "../../util/userSessionInfo";
import eye_icon from "./../../../../assets/Images/eye_icon.svg";

function AdminLogin() {
  userSessionInfo.isLoginRoute();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = userSessionInfo.logUserInfo();
  
  const isAdminLogin = location?.pathname === "/crm/admin/login";
  const isRMManagerLogin = location?.pathname === "/crm/login"
  const [loginForm, setLoginForm] = useState({
    user_login_name: "",
    password: "",
    user_type_id: isAdminLogin ? "admin" : "internal",
  });

  const [loginFormError, setLoginFormError] = useState({
    user_login_name: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  
  const [navigationUrl, setNavigationUrl] = useState(isAdminLogin ? '/crm/admin/admin-portal' :isRMManagerLogin?'/crm/admin/templateapproval': '/crm/dashboard');

  // Create a reference for the "user login id" input field
  const userNameInputRef = useRef<HTMLInputElement>(null);

  // Focus on the "user login id" input field when the component loads
  useEffect(() => {
    if (userNameInputRef.current) {
      userNameInputRef.current.focus();
    }
  }, []);

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name) {
      setLoginForm({ ...loginForm, [event.target.name]: event.target.value });
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const inputCtrlProps = {
    userName: {
      type: "text",
      name: "user_login_name",
      value: loginForm.user_login_name,
      onChange: handleFormChange,
      errorText:
        loginFormError?.user_login_name !== "" &&
        loginForm.user_login_name?.length === 0
          ? loginFormError.user_login_name
          : "",
      InputProps: {inputRef: userNameInputRef},
      inputRef: userNameInputRef, 
      autoFocus: true,
    },
    userPassword: {
      type: showPassword ? "text" : "password",
      name: "password",
      value: loginForm.password,
      onChange: handleFormChange,
      errorText:
        loginFormError?.password !== "" && loginForm?.password?.length === 0
          ? loginFormError.password
          : loginFormError?.password &&
            loginFormError?.password === "Invalid Credentials"
          ? loginFormError?.password
          : "",
      InputProps: {
        endAdornment: (
          <InputAdornment position="end" style={{ paddingRight: "20px" }}>
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
          {showPassword ? <img src="/images/eye.svg" alt="show password" /> : <img src="/images/eye-off.svg" alt="hide password" />}
            </IconButton>
          </InputAdornment>
        ),
      },
    },
  };

  const validatingFormData = async (loginForm: any) => {
    const result = { status: false, errorList: [] };
    try {
      await FormValidation.loginFormSchema.validate(loginForm, {
        abortEarly: false,
      });
    } catch (validationErrors: any) {
      let errors: any = {};
      validationErrors.inner.forEach((error: any) => {
        errors[error.path] = error.message;
      });
      result.status = true;
      result.errorList = errors;
    }
    return result;
  };

  const submitLogin = async () => {
    const { status, errorList }: any = await validatingFormData(loginForm);
    
    if (status) {
      setLoginFormError(errorList);
    } else {
      try {
        userSessionInfo.getClearSessionData();
        const { success, message, data } = await Api.postLogin(
          "auth_login",
          loginForm
        );
        if (success) {
          if (data.user_info|| data.personnelDetails) {
            userSessionInfo.setSessionData("user_info", data.user_info);
            userSessionInfo.setSessionData("key", data.token_info.key);
            userSessionInfo.setSessionData("token_info", data.token_info);
            userSessionInfo.setSessionData("personnel_Details", data.personnelDetails);
            navigate(navigationUrl);
          } else {
            setLoginFormError({
              user_login_name: "",
              password: "Invalid Credentials",
            });
          }
        } else {
          setLoginFormError({
            user_login_name: "",
            password: "Invalid Credentials",
          });
        }
      } catch (error) {
        console.error("Login failed:", error);
        setLoginFormError({
          user_login_name: "",
          password: "Invalid Credentials",
        });
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitLogin();
  };

  return (
    <Container
      maxWidth="xs"
      style={{
        backgroundColor: "white",
        borderRadius: "1rem",
        height: "530px",
        width: "430px",
      }}
    >
      <Box
        component="div"
        sx={{
          mt: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
          pl: 2,
        }}
      >
        <div>
          <img
            className="tw-mt-7 tw-w-20 md:tw-mr-8"
            src={"/logo.png"}
            alt=""
          />
        </div>
        <Typography
          component="h1"
          variant="h5"
          sx={{ color: "#25272D", width: "100px" }}
        >
         <div className='section-heading  tw-mt-5'>Welcome </div>

        </Typography>
        <Box
          component="form"
          sx={{ mt: 1 }}
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <Typography>Please enter your login details.</Typography>
          <div className="text_field_top">
            <p className="tw-ml-1">Login ID</p>
            <InputText {...inputCtrlProps.userName} />
          </div>
          <div>
            <p>Password</p>
            <InputText {...inputCtrlProps.userPassword} />
          </div>
          <div className="tw-flex tw-justify-end">
            <Link
              to={"/crm/forgotpassword"}
              className="tw-text-[15px] tw-w-32 tw-mb-1 tw-mt-5 text-pri-all tw-cursor-pointer"
            >
              Forgot Password
            </Link>
          </div>
          <div>
            <Button
              className="Button_style"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2, textTransform: "capitalize" ,fontWeight : 'bold'}}
            >
              Sign in
            </Button>
          </div>
        </Box>
      </Box>
    </Container>
  );
}

export default AdminLogin;
