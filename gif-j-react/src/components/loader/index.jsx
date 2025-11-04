import React from "react";
import { Spin } from "antd";

import "./style.css";

export const Loader = ({ ClassName }) => {
  return (
    <div className={ClassName ? ClassName : "loader__page"}>
      <Spin size="large" />
    </div>
  );
};
