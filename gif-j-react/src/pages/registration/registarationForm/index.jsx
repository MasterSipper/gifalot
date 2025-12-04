import React from "react";
import { useNavigate } from "react-router";
import { Button, Form, Input } from "antd";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import { useCaptcha } from "../../../hooks/useCaptcha";
import { register } from "../../../store/slices/userSlice";
import { useDispatch } from "react-redux";
import { routes } from "../../../static/routes";

export const RegistrationForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { clickHandler, token, handleVerify } = useCaptcha();

  const onFinish = async (values) => {
    const result = await dispatch(register({ ...values, token }));
    
    // Check if registration was successful and we have a redirect URL
    if (result.type === 'auth/register/fulfilled') {
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
        navigate(routes.login);
      }
    } else {
      // Registration failed, stay on page
    }
  };

  return (
    <Form
      name="basic"
      layout={"vertical"}
      className={"form"}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="on"
    >
      <h1 className={"form__header"}>Create a account</h1>

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
        <Input.Password
          required={true}
          className={"input"}
          minLength={8}
          maxLength={64}
        />
      </Form.Item>

      <Form.Item
        label="Confirm"
        name="confirm"
        dependencies={["password"]}
        rules={[
          {
            message: "Please confirm your password",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Passwords do not match"));
            },
          }),
        ]}
      >
        <Input.Password required={true} className={"input"} />
      </Form.Item>

      <Form.Item>
        <Button
          direction="vertical"
          className={"logic__btn"}
          type="primary"
          htmlType="submit"
          onClick={clickHandler}
        >
          Create account
        </Button>
      </Form.Item>

      <GoogleReCaptcha onVerify={handleVerify} action={"register"} />
    </Form>
  );
};
