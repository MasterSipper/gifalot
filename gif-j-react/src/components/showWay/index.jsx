//Breadcrumb

// import React from "react";
// import { Breadcrumb } from "antd";
// import { useLocation } from "react-router";
// import { Link } from "react-router-dom";
//
// export const ShowWay = () => {
//   const location = useLocation();
//
//   let count = 0;
//
//   location.pathname.split("").forEach((item) => {
//     if (item === "/") {
//       return count++;
//     }
//   });
//
//   console.log(location.pathname);
//
//   return (
//     <Breadcrumb separator="/">
//       <Breadcrumb.Item>
//         <Link to={"/"}>Home</Link>
//       </Breadcrumb.Item>
//       {count > 1 && <Breadcrumb.Item>test</Breadcrumb.Item>}
//     </Breadcrumb>
//   );
// };
