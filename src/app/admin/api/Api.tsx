import userSessionInfo from "./../util/userSessionInfo";
import axios from 'axios';
import getApiUrl from "./ApiUrls";
let headerInfo = {headers:{"client-code": "myhome", key:""}};
const resInfo = {status: true, data: [], message:"", statuscode: 200}
const postLogin = async (urlName: string, body: any, paramsData = "") => {
    let url = getApiUrl.getApiUrlInfo(urlName);
    return axios.post(url, body, headerInfo).then((response) => {
        return response.data;
    }).catch((e) => {
        return { success: false, data: e.response.data.data, message: e.response.data.message};
    });
};

const getLogout = async (url: string) => {
    //axios.defaults.withCredentials = false;
    return axios.get(url).then((response) => {
        return response.data;
    }).catch((e) => {
        return { success: false, data: e.response.data.data, message: e.response.data.message};
    });
};

const post = async (urlName: string, body: any, paramsData = "") => {
    const queryParam = convertQueryparam(paramsData);
    const tokenInfo = userSessionInfo.getJwtToken();
    headerInfo.headers.key = tokenInfo.key;
    let url = getApiUrl.getApiUrlInfo(urlName);
    return axios.post(url, body, headerInfo).then((response) => {
        if(response.data.success){
            return {status: true, data: response.data.data, message: response?.data?.message, statuscode: 200};
        }else{
            return {status: false, data: response.data, message: response?.data?.message, statuscode: 200};
        }
    }).catch((e) => {
        return { status: false, data: "", message: e.response.data.message};
    });
};
  
const get = async (urlName: string, paramsData: any) => {
  const queryParam = convertQueryparam(paramsData);
  const tokenInfo = userSessionInfo.getJwtToken();
  headerInfo.headers.key = tokenInfo.key;
  let url = getApiUrl.getApiUrlInfo(urlName) + queryParam;
  //const headerInfos = {headers:{authorization: jwtToken}};
  return axios.get(url, headerInfo).then((response) => {
    return {
        status: true,
        data: response?.data?.data,
        message: response?.data?.message,
        statuscode: 200
    };
    }).catch((error) => {
    //console.log(error.response.status);
    //console.log(error.response?.data?.status);
        let statusNo = 0;
        if(error?.response?.status === 403){
            statusNo = 403;
        }else{
            statusNo = error.response?.data?.status;
        }
        return { status: false, data: error?.response?.data, statuscode: statusNo, message: error};
    });
};

const put = async (urlName: string, body: any) => {
//let url = getAipUrl(urlName);
let url = "";
//const headerInfo = {headers: {"token": UserSessionInfo.getJwtToken()}};
return axios.put(url, headerInfo).then((response) => {
    return response.data;
    }).catch((error) => {
    return { status: "error", statuscode: error.response?.data?.status };
    });
};

const del = async (urlName: string) => {
//let url = getAipUrl(urlName);
let url = "";
//const headerInfo = {headers: {"token": UserSessionInfo.getJwtToken()}};
return axios.delete(url, headerInfo)
    .then((response) => {
    return response.data;
    })
    .catch((error) => {
    return { status: "error", statuscode: error.response?.data?.status };
    });
};

const convertQueryparam = (queryData: any) => {
    let params = "";
    if(Object.keys(queryData).length > 0){
        params += new URLSearchParams(queryData);
        return "?"+params.toString();
    }
    return params;
};

const Api = { postLogin, getLogout, post, get, put, del };
export default Api;