import { LOCAL_STORAGE_DATA_KEYS } from '@Constants/localStorageDataModel';
import { IAPIResponse } from "@Src/types/api-response-interface";
import { getDataFromLocalStorage } from "@Src/utils/globalUtilities";
import axios from "axios";
import { toast } from "react-toastify";

export const MODULES_API_MAP = {
    AUTHENTICATION: process.env.REACT_APP_CRM_AUTH_API_URL,
}


export function httpService(moduleBaseApiUrl: string | undefined = "", endpoint: string, showErrorToast = false, requireAuth = true, customHeaders: any = undefined, rawResponse = false) {
    const httpInstance = axios.create({});
    // //console.log("base url")
    // //console.log(moduleBaseApiUrl)
    if (requireAuth) {
        httpInstance.interceptors.request.use((config:any) => {
            let key = getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.AUTH_KEY);
            config.headers = {
                key: key,
            };
            if (customHeaders && Object.keys(customHeaders).length > 0) {
                config.headers = {
                    key: key,
                    ...customHeaders
                }
            }
            config.baseURL = moduleBaseApiUrl;
            config.headers['client-code'] = 'myhome';
            return config;
        });
    }

    async function GET() {
        try {
            let apiResponse = await httpInstance.get<IAPIResponse, any>(endpoint);
            if (rawResponse) {
                return apiResponse;
            }
            return apiResponse?.data;
        } catch (err: any) {
            if (showErrorToast) {
                if (err?.response.data.errors && err?.response.data?.errors[0]?.message)
                    toast.error(err?.response.data?.errors[0]?.message);
                else
                    toast.error('Something went wrong, please try later');
            } else {
                return Promise.reject(err);
            }
        }
    }

    async function POST(requestObject: any) {
        try {
            let apiResponse = await httpInstance.post<IAPIResponse, any>(endpoint, requestObject);
            if (rawResponse) {
                return apiResponse;
            }
            return apiResponse?.data;
        } catch (err: any) {
            return err?.response.data
            // if (showErrorToast) {
            //     if (err?.response.data.errors && err?.response.data?.errors[0]?.message){
            //         toast.error(err?.response.data?.errors[0]?.message);
            //         return err?.response.data ;
            //     } 
            // } else {
            //     // return Promise.reject(err);
            //     return err?.response.data ;
            // }
        }
    }

    async function PUT(requestObject: any) {
        try {
            let apiResponse = await httpInstance.put<IAPIResponse, any>(endpoint, requestObject);
            if (rawResponse) {
                return apiResponse;
            }
            return apiResponse?.data;
        } catch (err: any) {
            if (showErrorToast) {
                if (err?.response.data.errors && err?.response.data?.errors[0]?.message)
                    toast.error(err?.response.data?.errors[0]?.message);
                else
                    toast.error('Something went wrong, please try later');
            } else {
                return Promise.reject(err);
            }
        }
    }

    async function DELETE() {
        try {
            let apiResponse = await httpInstance.delete<IAPIResponse, any>(endpoint);
            if (rawResponse) {
                return apiResponse;
            }
            return apiResponse?.data;
        } catch (err: any) {
            if (showErrorToast) {
                if (err?.response.data.errors && err?.response.data?.errors[0]?.message)
                    toast.error(err?.response.data?.errors[0]?.message);
                else
                    toast.error('Something went wrong, please try later');
            } else {
                return Promise.reject(err);
            }
        }
    }

    async function PATCH(requestObject: any) {
        try {
            let apiResponse = await httpInstance.put<IAPIResponse, any>(endpoint, requestObject);
            if (rawResponse) {
                return apiResponse;
            }
            return apiResponse?.data;
        } catch (err: any) {
            if (showErrorToast) {
                if (err?.response.data.errors && err?.response.data?.errors[0]?.message)
                    toast.error(err?.response.data?.errors[0]?.message);
                else
                    toast.error('Something went wrong, please try later');
            } else {
                return Promise.reject(err);
            }
        }
    }

    return { GET, POST, PUT, PATCH, DELETE }
}
