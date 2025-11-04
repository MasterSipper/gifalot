import React from "react";
import { Button, Form, Input, notification } from "antd";
import { useNavigate } from "react-router";
import { routes } from "../../../../../static/routes";
import axios from "axios";
import { apiUrl, confirmReset } from "../../../../../static/api";

export const ConfirmPassword = ({ changeStep, values }) => {
  const navigate = useNavigate();
  const { email, code } = values;

  const onFinish = async (data) => {
    const { password } = data;
    try {
      await axios.post(`${apiUrl}${confirmReset}`, { email, code, password });

      navigate(routes.login);
      changeStep(1);

      notification.success({
        message: `Password were changed`,
      });
    } catch (e) {
      if (
        e.response.data.message === "Code is expired" ||
        e.response.data.message === "Invalid code"
      ) {
        changeStep(1);
      }

      notification.info({
        message: e.response.data.message,
      });
    }
  };

  return (
    <Form
      layout={"vertical"}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="on"
      className={"reset_form"}
    >
      <Form.Item label="Password :" name="password">
        <Input.Password
          required={true}
          className={"input"}
          minLength={8}
          maxLength={64}
        />
      </Form.Item>

      <Form.Item
        label="Confirm you password :"
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
          style={{ width: "100%" }}
          type="primary"
          htmlType="submit"
        >
          Send new password
        </Button>
      </Form.Item>
    </Form>
  );
};
