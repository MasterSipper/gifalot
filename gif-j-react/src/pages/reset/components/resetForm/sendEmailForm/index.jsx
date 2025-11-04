import React from "react";
import { Button, Form, Input, notification } from "antd";
import axios from "axios";
import { apiUrl, reset } from "../../../../../static/api";

export const SendEmailForm = ({ changeStep, changeValues }) => {
  const onFinish = async (values) => {
    try {
      await axios.post(`${apiUrl}${reset}`, { email: values.email });
      changeValues(values.email);
      changeStep((prevState) => prevState + 1);
    } catch (e) {
      if (e.response.data.message === "Code already sent") {
        changeStep(1);
        notification.info({
          message: `Try again in 1 minute`,
        });
      }
    }
  };

  return (
    <Form
      layout={"horizontal"}
      initialValues={{ email: "" }}
      onFinish={onFinish}
      autoComplete="on"
      className={"reset_form"}
    >
      <Form.Item
        label="Email :"
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

      <Form.Item>
        <Button
          direction="vertical"
          style={{ width: "100%" }}
          type="primary"
          htmlType="submit"
        >
          Send
        </Button>
      </Form.Item>
    </Form>
  );
};
