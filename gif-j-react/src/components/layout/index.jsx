import React from "react";
import { Outlet } from "react-router";
import { Sidebar } from "../sidebar";
import {Helmet} from "react-helmet";


import "./style.css";


export const Layout = () => {
  return (
    <div className={"layout"}>
        <Helmet>
            <title>Gifalot</title>
            <meta name="description" content="Build your own visuals with Gifalot" />
            <meta name="application-name" content={"Gifalot"} />
        </Helmet>
      <Sidebar />
      <Outlet />
    </div>
  );
};
