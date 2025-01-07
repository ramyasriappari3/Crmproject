import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import userSessionInfo from "../util/userSessionInfo";

const Protected = (props: any) => {
    const logUserInfo = userSessionInfo.logUserInfo();
    const userStatue = true;
    if (logUserInfo) {
        return <Outlet />
    } else {
        return <Navigate to="/crm/login" />
    }
    // return (
    //     userStatue?<Outlet/>:<Navigate to="/login"/>
    // )

    // return <Outlet />
}
export default Protected;

