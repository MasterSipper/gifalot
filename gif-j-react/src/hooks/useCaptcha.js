import React from "react";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export function useCaptcha() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [token, setToken] = React.useState("");

  const handleVerify = React.useCallback(async (test) => {
    setToken(test);
  }, []);

  const clickHandler = React.useCallback(async () => {
    if (!executeRecaptcha) {
      return;
    }

    const result = await executeRecaptcha();
    setToken(result);
  }, [executeRecaptcha]);

  return { clickHandler, handleVerify, token };
}
