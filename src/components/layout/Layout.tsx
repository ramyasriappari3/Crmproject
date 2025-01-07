import { Suspense, lazy, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { getDataFromLocalStorage } from "@Src/utils/globalUtilities";
import { LOCAL_STORAGE_DATA_KEYS } from "@Constants/localStorageDataModel";
import { AppRouteURls } from "@Constants/app-route-urls";
import Loader from "@Components/loader/Loader";
import LeftSidebar from "@Components/left-sidebar/LeftSidebar";
import Header from "@Components/header/Header";
import FooterPage from "@Components/footer/FooterPage";
import PaymentsTab from "@Components/payments-tab/PaymentsTab";
import Application from "@Src/app/admin/pages/application/Application";
import BookSlots from "@Pages/car-parking-home-page/book-slots/BookSlots";
import BasementsPage from "@Pages/car-parking-home-page/basements-page/BasementsPage";
import MyAccountPage from "@Pages/my_account_page/MyAccountPage";
import ErrorPage from "@Pages/error-pages/ErrorPage";
import "./Layout.scss";
import BasisEligibilityContainer from "@Src/app/admin/pages/parking-rules/BasisEligibilityContainer";
import FlatRangeContainer from "@Src/app/admin/pages/parking-rules/FlatRangeContainer";
import FloorRangeContainer from "@Src/app/admin/pages/parking-rules/FloorRangeContainer";
import OptionsContainer from "@Src/app/admin/pages/parking-rules/OptionsContainer";
import LocationAllocationContainder from "@Src/app/admin/pages/parking-rules/LocationAllocationContainder";
import ProjectContainer from "@Src/app/admin/pages/parking-rules/ProjectContainer";
import HomeLoanPage from "@Pages/home-loan-page/HomeLoanPage";
import lazyWithRetry from "@Src/app/admin/util/lazyWithRetry";

const Navbar = lazyWithRetry(() => import("@Components/navbar/Navbar"));
const MyHome = lazyWithRetry(() => import("@Pages/my-home/MyHome"));
const MyTaskPage = lazyWithRetry(() => import("@Pages/my-task/MyTaskPage"));
const HelpPage = lazyWithRetry(() => import("@Pages/help/HelpPage"));
const MyPropertyPage = lazyWithRetry(() => import("@Pages/my-property/MyPropertyPage"));
const MyPropertyDetails = lazyWithRetry(() => import("@Pages/my-property-details/MyPropertyDetails"));
const TdsPage = lazyWithRetry(() => import("@Pages/tds-page/TdsPage"));
const CustomerPaymentProof = lazyWithRetry(() => import("@Pages/customer-payment-proof/CustomerPaymentProof"));

const NavbarLayout: React.FC = () => (
  <div className="md:tw-mt-20 tw-mt-4 tw-mb-0 ">
    <div className="tw-hidden md:tw-block">
      <Navbar />
    </div>
    <div className="">
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    </div>
  </div>
);

const SidebarLayout: React.FC = () => (
  <div className="layout-sidebar md:tw-pb-0 tw-pb-[100px]">
    <div className="tw-hidden lg:tw-block">
      <LeftSidebar />
    </div>
    <div className="all-layout">
      <Header />
      <div className="page-container-sidebar">
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </div>
      <div className="tw-block lg:tw-hidden">
        <FooterPage />
      </div>
    </div>
  </div>
);

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();

  useEffect(() => {
    if (!getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.AUTH_KEY)) {
      navigate(`/${AppRouteURls.LOG_IN}`);
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="*" element={<ErrorPage />} />
      <Route element={<NavbarLayout />}>
        <Route path={AppRouteURls.MY_HOME} element={<MyHome />} />
        <Route
          path={AppRouteURls.MY_APPLICATION_FORM}
          element={<Application bottomBarPosition={"fixed"} />}
        />
        <Route path={AppRouteURls.BOOK_SLOTS} element={<BookSlots />} />
        <Route path={AppRouteURls.BASEMENT_PAGE} element={<BasementsPage />} />
      </Route>
      <Route element={<SidebarLayout />}>
        {/* <Route
          path={AppRouteURls.PARKING}
          element={<ProjectContainer />}
          />
          <Route
          path={AppRouteURls.PARKING_BASIS}
          element={<BasisEligibilityContainer />}
          />
          <Route
          path={AppRouteURls.PARKING_FLAT_RANGE}
          element={<FlatRangeContainer />}
          />
          <Route path={AppRouteURls.PARKING_FLOOR_RANGE} element={<FloorRangeContainer />} />
          <Route path={AppRouteURls.PARKING_FLOOR_RANGE} element={<FloorRangeContainer />} />
          <Route path={AppRouteURls.PARKING_OPTIONS} element={<OptionsContainer />} />
          <Route path={AppRouteURls.PARKING_LOCATIONS} element={<LocationAllocationContainder />} /> */}
        <Route path={AppRouteURls.DASHBOARD} element={<MyPropertyPage />} />
        <Route path={AppRouteURls.MY_PROPERTY_DETAILS} element={<MyPropertyDetails />} />
        <Route path={AppRouteURls.PAYMENTS_TAB} element={<PaymentsTab unit_Id={propertyId} />} />
        <Route path={AppRouteURls.CUSTOMER_PAYMENTS_PROOF} element={<CustomerPaymentProof />} />
        <Route path={AppRouteURls.TDS_INFO} element={<TdsPage />} />
        <Route path={AppRouteURls.HOME_LOAN_PAGE} element={<HomeLoanPage />} />
        <Route path={AppRouteURls.MY_TASK} element={<MyTaskPage />} />
        <Route path={AppRouteURls.HELP} element={<HelpPage />} />
        <Route path={AppRouteURls.MY_ACCOUNT_VIEW} element={<MyAccountPage />} />
      </Route>
    </Routes>
  );
};

export default Layout;
