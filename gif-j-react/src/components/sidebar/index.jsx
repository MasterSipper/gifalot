import React from "react";
import { Button, Menu, Typography } from "antd";
import { useNavigate } from "react-router";
import { routes } from "../../static/routes";
import { useDispatch } from "react-redux";
import { sidebarItems } from "../../static/sibarItems";
import { logOut } from "../../store/slices/userSlice";
import { apiUrl } from "../../static/api";

import logo from "../../assets/logo/logo.png";

import "./style.css";

const { Text } = Typography;

export const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [current, setCurrent] = React.useState(routes.dashboard);

  const onClick = (e) => {
    setCurrent(e.key);
    navigate(`/${e.key}`);
  };

  const logOutUser = async () => {
    dispatch(logOut());
  };

  // Determine backend type and display info
  const getBackendInfo = () => {
    const url = apiUrl || "http://localhost:3001/gif-j/";
    const isLocal = url.includes("localhost") || url.includes("127.0.0.1");
    const isContabo = url.includes("38.242.204.63") || url.includes("contabo");
    
    if (isLocal) {
      return {
        type: "Local",
        url: url,
        color: "#52c41a" // green
      };
    } else if (isContabo) {
      return {
        type: "Contabo",
        url: url,
        color: "#1890ff" // blue
      };
    } else {
      return {
        type: "Custom",
        url: url,
        color: "#faad14" // orange
      };
    }
  };

  const backendInfo = getBackendInfo();

  return (
    <div className={"sidebar__wrapper"}>
      <div>
        <div className={"sidebar__header"}>
          <img src={logo} alt={"logo"} />
          <h3>Gifalot</h3>
        </div>
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="inline"
          theme={"light"}
          items={sidebarItems}
        />
        <div className={"sidebar__backend_info"}>
          <div className={"sidebar__backend_label"}>Backend:</div>
          <Text 
            strong 
            style={{ 
              color: backendInfo.color,
              fontSize: "12px"
            }}
          >
            {backendInfo.type}
          </Text>
          <div className={"sidebar__backend_url"}>
            <Text type="secondary" style={{ fontSize: "10px" }}>
              {backendInfo.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </Text>
          </div>
        </div>
      </div>
      <div className={"sidebar__buttons"}>
        <Button type="text" onClick={logOutUser}>
          Log out
        </Button>
      </div>
    </div>
  );
};
