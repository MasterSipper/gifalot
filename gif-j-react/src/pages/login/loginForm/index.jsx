import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { routes } from "../../../static/routes";
import { login } from "../../../store/slices/userSlice";
import { GoogleReCaptcha, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useCaptcha } from "../../../hooks/useCaptcha";

import "./style.css";

export const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = React.useState(false);

  const { token, handleVerify } = useCaptcha();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Ensure captcha token is set before submitting
      let captchaToken = token;
      if (!captchaToken && executeRecaptcha) {
        try {
          captchaToken = await executeRecaptcha("login");
        } catch (error) {
          console.error("Failed to get reCAPTCHA token:", error);
        }
      }
      
      const result = await dispatch(login({ ...values, token: captchaToken || "" }));
      
      // Only navigate if login was successful
      if (login.fulfilled.match(result)) {
        // Check if we have a redirect URL stored
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
          sessionStorage.removeItem('redirectAfterLogin');
          // Extract folderId from player URL if it's a public player
          const playerMatch = redirectUrl.match(/\/(\d+)\/(\d+)\/carousel/);
          if (playerMatch) {
            // Public player URL - redirect to compilation edit page for that folder
            const folderId = playerMatch[2];
            navigate(`/${routes.dashboard}/${folderId}`);
          } else {
            // Try to extract folderId from private player URL
            const privatePlayerMatch = redirectUrl.match(/\/player\/(\d+)/);
            if (privatePlayerMatch) {
              const folderId = privatePlayerMatch[1];
              navigate(`/${routes.dashboard}/${folderId}`);
            } else {
              navigate(redirectUrl);
            }
          }
        } else {
          navigate(`/${routes.dashboard}`);
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Login error:', error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const onFinishFailed = (errorInfo) => {
    console.error("Form validation failed:", errorInfo);
  };

  const toRegistration = () => {
    navigate(`${routes.reg}`);
  };

  const toReset = () => {
    navigate(`${routes.reset}`);
  };

  return (
    <Form
      name="basic"
      layout={"vertical"}
      className={"form"}
      initialValues={{ remember: false }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="on"
    >
      <h1 className={"form__header"}>Login</h1>
      <p className={"subheader__p"}>
        Welcome back, please login to your account.
      </p>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          () => ({
            validator(_, value) {
              if (!value) {
                return Promise.reject(new Error("Field is required"));
              } else if (!/\S+@\S+\.\S+/.test(value)) {
                return Promise.reject(new Error("Invalid email format"));
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input required={true} className={"input"} />
      </Form.Item>
      <Form.Item label="Password" name="password">
        <Input.Password required={true} className={"input"} minLength={8} />
      </Form.Item>
      <div className={"inner__section"}>
        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <Form.Item>
          <p onClick={toReset}>forgot password?</p>
        </Form.Item>
      </div>

      <Form.Item>
        <Button
          direction="vertical"
          className={"logic__btn"}
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading}
        >
          Log In
        </Button>
      </Form.Item>
      <div className={"form__footer"}>
        <p className={"footer__p"}>Don't you have an account?</p>
        <p className={"footer__create"} onClick={toRegistration}>
          Create an account
        </p>
      </div>

      <GoogleReCaptcha
        action={"login"}
        refreshReCaptcha={true}
        onVerify={handleVerify}
      />
    </Form>
  );
};
