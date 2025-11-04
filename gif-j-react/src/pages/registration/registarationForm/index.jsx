import React from "react";
import { useNavigate } from "react-router";
import { Button, Form, Input } from "antd";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import { useCaptcha } from "../../../hooks/useCaptcha";
import { register } from "../../../store/slices/userSlice";
import { useDispatch } from "react-redux";

export const RegistrationForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { clickHandler, token, handleVerify } = useCaptcha();

  const onFinish = async (values) => {
    await dispatch(register({ ...values, token }));
    navigate(`/`);
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
