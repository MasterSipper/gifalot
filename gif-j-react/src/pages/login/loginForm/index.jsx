import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { routes } from "../../../static/routes";
import { login } from "../../../store/slices/userSlice";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import { useCaptcha } from "../../../hooks/useCaptcha";

import "./style.css";

export const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { clickHandler, token, handleVerify } = useCaptcha();

  const onFinish = async (values) => {
    await dispatch(login({ ...values, token }));
    navigate(`/${routes.dashboard}`);
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
          onClick={clickHandler}
        >
          Log In
        </Button>
      </Form.Item>
      <div className={"form__footer"}>
        <p className={"footer__p"}>Don’t you have an account?</p>
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
