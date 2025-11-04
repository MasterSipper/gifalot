import React from "react";
import { Button, Form, Input } from "antd";

export const SendCode = ({ changeStep, changeValues }) => {
  const onFinish = async (values) => {
    const { code } = values;
    changeValues(code);
    changeStep((prevState) => prevState + 1);
  };

  return (
    <Form
      layout={"vertical"}
      initialValues={{ code: "" }}
      onFinish={onFinish}
      autoComplete="on"
      className={"reset_form"}
    >
      <Form.Item label="Enter you code :" name="code">
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
