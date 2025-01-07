
import React, { ReactNode } from 'react';
import Header from '../layout/header/Header'
import { Outlet } from 'react-router-dom';
import LeftSideBar from '../layout/leftsidebar/LeftSidebar';
//  import AdminSideBarMenu from '../pages/admin-left-sidebar/AdminLeftSideBar';
import ApplicationFormDetailes from '../pages/applicationformdetails/ApplicationFormDetailes';
import ApplicationInformation from '../pages/applicant-information/ApplicationInformation';


interface AdminLayoutProps {
    children?: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({children}) => {
    return (
        <React.Fragment>
            <Header/>
            <LeftSideBar/>
           
        </React.Fragment>
    );    
};
export default AdminLayout;