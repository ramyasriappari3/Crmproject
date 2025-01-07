
interface TokenInfo {
    key: string;
    refresh_token: string;
    access_token: string;
}

const setSessionData = (keyName: string, storeData: any) => {
    if (keyName && storeData) {
        sessionStorage.setItem(keyName, JSON.stringify(storeData));
        return true;
    } return false;
}

const getClearSessionData = () => {
    sessionStorage.clear();
    localStorage.clear();
    const userInfo = sessionStorage.getItem('user_info');
    if (userInfo !== null) {
        return false;
    } return true;
}

const isLoginRoute = () => {
    if (logUserInfo()) {
        const userInfo:any = sessionStorage.getItem('user_info');
        console.log("userinfo",userInfo)
        if(userInfo?.user_type_id == 'internal'){
            window.location.href = "/crm/dashboard";
        }else if(userInfo?.user_type_id == 'admin'){
            window.location.href = "/crm/admin/faq";
        }
       
    }
}

const logUserInfo = () => {
    const userInfo = sessionStorage.getItem('user_info');
    if (userInfo !== null) {
        return JSON.parse(userInfo);
    } return false;
}

const logPersonnelDetailsInfo = () => {
    const PersonnelDetailsInfo = sessionStorage.getItem('personnel_Details');
    if (PersonnelDetailsInfo !== null) {
        return JSON.parse(PersonnelDetailsInfo);
    } return false;
}

const logUserId = () => {
    const userInfo = sessionStorage.getItem('user_info');
    if (userInfo !== null) {
        return JSON.parse(userInfo).rm_user_name;
    } return "";
}

const getJwtToken = (): TokenInfo => {
    const storedToken = sessionStorage.getItem('token_info');
    if (storedToken !== null) {
        const tokenInfo: TokenInfo | null = JSON.parse(storedToken);
        if (tokenInfo !== null && tokenInfo !== undefined) {
            return tokenInfo;
        }
    }
    return { key: "", access_token: "", refresh_token: "" };
};

const logUserRole = () => {
    const userRoles = sessionStorage.getItem('userRoles')
    if (userRoles !== null) {
        return JSON.parse(userRoles).roleType;
    } return false;
}

const getUserType = () => {
    const checkCrm = window.location.href.includes("crm");
    if (checkCrm)
        return 'crm';
    else
        return 'customer';
}
const userSessionInfo = { setSessionData, getClearSessionData, logUserInfo,logPersonnelDetailsInfo, logUserRole, getJwtToken, isLoginRoute, logUserId, getUserType };
export default userSessionInfo;