import { IUser } from "@Constants/global-interfaces";
import { LOCAL_STORAGE_DATA_KEYS } from "@Constants/localStorageDataModel";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IAPIResponse } from "@Src/types/api-response-interface";
import { setDataOnLocalStorage, removeDataFromLocalStorage, decodeString } from "@Src/utils/globalUtilities";
import { hideSpinner, showSpinner } from "@Features/global/globalSlice";
import { MODULES_API_MAP, httpService } from "@Src/services/httpService";
import { GLOBAL_API_ROUTES } from "@Src/services/globalApiRoutes";

export const loginWithPasswordAction = createAsyncThunk(
    "login/fromPassword",
    async (loginObj: { pan_card: string, password: string ,user_type_id :string }, thunkAction) => {
        ////console.log("loginObj",loginObj)
        try {
            thunkAction.dispatch(showSpinner());
            const response: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, GLOBAL_API_ROUTES.LOGIN_WITH_PASSWORD, false).POST(loginObj)
            thunkAction.dispatch(hideSpinner());
            const { session, sessionDetails } = response.data as { session: string, sessionDetails: any };
            setDataOnLocalStorage(LOCAL_STORAGE_DATA_KEYS.AUTH_KEY, session);
            const userDetails:any = decodeString(sessionDetails?.token);
            setDataOnLocalStorage(LOCAL_STORAGE_DATA_KEYS.USER_DETAILS, userDetails)
            setDataOnLocalStorage(LOCAL_STORAGE_DATA_KEYS.AUTH_TOKEN, sessionDetails?.token);
            ////console.log(userDetails)

            return response;
        } catch (err: any) {
            thunkAction.dispatch(hideSpinner());
            return thunkAction.rejectWithValue(err.response.data);
        }
    }
)


export interface IAuthState {
    user: IUser | null;
    loginError: string;
    isLoggedIn: boolean;
}

const initialState: IAuthState = {
    user: null,
    loginError: "",
    isLoggedIn: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        logout: (state) => {            
            return { isLoggedIn: false, user: null, loginError: "" }
        },
        setUserData: (state, action) => {
            return { isLoggedIn: action.payload.isLoggedIn, user: action.payload.user, loginError: "" }
        }
    },
    extraReducers: {
        [loginWithPasswordAction.fulfilled as any]: (state, action) => {
            return { isLoggedIn: true, user: action.payload.data, loginError: "" }
        },
        [loginWithPasswordAction.pending as any]: (state, action) => {
            return { isLoggedIn: false, user: null, loginError: "" }
        },
        [loginWithPasswordAction.rejected as any]: (state, action) => {
            return { isLoggedIn: false, user: null, loginError: action.payload }

        },
    },
})

export const { logout, setUserData } = authSlice.actions;
export default authSlice.reducer;