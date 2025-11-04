import React from "react";
import { Button, Menu } from "antd";
import { useNavigate } from "react-router";
import { routes } from "../../static/routes";
import { useDispatch } from "react-redux";
import { sidebarItems } from "../../static/sibarItems";
import { logOut } from "../../store/slices/userSlice";

import logo from "../../assets/logo/logo.png";

import "./style.css";

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
      </div>
      <div className={"sidebar__buttons"}>
        <Button type="text" onClick={logOutUser}>
          Log out
        </Button>
      </div>
    </div>
  );
};
