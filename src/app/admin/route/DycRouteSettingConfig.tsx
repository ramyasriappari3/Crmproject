import React from 'react';
import { BrowserRouter as AppRouter, Routes, Route } from 'react-router-dom';
import Protected from '../protector/Protected';


const DycRouteSettingConfig = (props: any) => {

    const { routeLayout, protectRoute, routeList, index } = props;

    if (protectRoute === true && routeLayout !== "") {
        return (<Routes>
            <Route element={routeLayout}>
                {routeList.map((route: any, i: number) => {
                    if (route.path === '/') {
                        return <Route path={route.path} element={<route.element />} />
                    }
                    return <Route key={index + '-' + i} element={<Protected userRoles={route.roles} />}>
                        <Route path={route.path} element={<route.element />} />
                    </Route>
                })}
            </Route>
        </Routes>);
    } else {
        return (<Routes>
            {routeList.map((route: any, i: number) => {
                return <Route key={index + '-' + i} path={route.path} element={<route.element />} />
            })}
        </Routes>);
    }
}
export default DycRouteSettingConfig;