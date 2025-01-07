import { AppRouteURls } from "@Constants/app-route-urls";
import { LOCAL_STORAGE_DATA_KEYS } from "@Constants/localStorageDataModel";
import { useAppSelector } from "@Src/app/hooks";
import { getDataFromLocalStorage } from "@Src/utils/globalUtilities";
import React, { useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";

interface IProps {
  children: JSX.Element;
}

const AuthGuardRoute = ({ children }: IProps): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);
  const key = getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.AUTH_KEY);
  const userApplicationStatus = getDataFromLocalStorage(
    LOCAL_STORAGE_DATA_KEYS.APPLICATION_STATUS
  );
  const customer_profile_id = getDataFromLocalStorage(
    LOCAL_STORAGE_DATA_KEYS.CUST_PROFILE_ID
  );
  const customer_unit_id = getDataFromLocalStorage(
    LOCAL_STORAGE_DATA_KEYS.CUST_UNIT_ID
  );
  const restrictedPath = [
    `/${AppRouteURls.MY_HOME}`,
    `/my-application-form/${customer_profile_id}/${customer_unit_id}`,
  ];

  useEffect(() => {
    if (!key && !user) {
      navigate(AppRouteURls.LOG_IN);
    }
    else {
        switch (userApplicationStatus) {
            case 'Not Submitted':
            case 'Re-Draft':
                if (location.pathname !== AppRouteURls.MY_HOME && location.pathname !== `/my-application-form/${customer_profile_id}/${customer_unit_id}`) {
                    navigate(AppRouteURls.MY_HOME);
                }
                break;
            case 'Submitted':
                if (location.pathname !== AppRouteURls.MY_HOME) {
                    navigate(AppRouteURls.MY_HOME);
                }
                break;
            case 'Approved':
                if (restrictedPath.includes(location.pathname)) {
                    navigate(AppRouteURls.DASHBOARD);
                }
                break;
            default:
                navigate(AppRouteURls.MY_HOME);
                break;
        }
    }
  }, [key, user, userApplicationStatus, navigate, location.pathname]);

  return key || user ? children : <Navigate to={AppRouteURls.LOG_IN} />;
};

export default AuthGuardRoute;
