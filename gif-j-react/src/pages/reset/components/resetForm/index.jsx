import React from "react";
import { SendEmailForm } from "./sendEmailForm";
import { SendCode } from "./sendCode";
import { ConfirmPassword } from "./confirmPassworn";

export const ResetForm = () => {
  const [step, setStep] = React.useState(1);

  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");

  const renderItem = () => {
    switch (step) {
      case 1:
        return <SendEmailForm changeStep={setStep} changeValues={setEmail} />;

      case 2:
        return <SendCode changeStep={setStep} changeValues={setCode} />;

      case 3:
        return (
          <ConfirmPassword changeStep={setStep} values={{ email, code }} />
        );
      default:
        return <SendEmailForm />;
    }
  };

  return renderItem();
};
