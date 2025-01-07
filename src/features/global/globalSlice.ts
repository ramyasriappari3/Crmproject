import { createSlice } from '@reduxjs/toolkit';
export interface IGlobalState {
	loading: boolean;
	theme: 'dark' | 'light';
	formSubmitAndExit: boolean;
	formSubmitAndNext: boolean;
	backButtonClicked: boolean;
	isPaymentRoute: boolean;
	isApplicationDownload: boolean;
	otp: string;
	email:string;
}


const initialState: IGlobalState = {
	loading: false,
	theme: 'dark',
	formSubmitAndExit: false,
	formSubmitAndNext: false,
	backButtonClicked: false,
	isPaymentRoute: false,
	isApplicationDownload: false,
	otp: '',
	email: ''
};

const globalSlice = createSlice({
	name: "global",
	initialState,
	reducers: {
		showSpinner: (state) => {
			state.loading = true;
		},
		hideSpinner: (state) => {
			state.loading = false;
		},
		triggerSaveAndExitEvent: (state, payload) => {
			state.formSubmitAndExit = payload.payload;
		},
		triggerSaveAndNextEvent: (state, payload) => {
			state.formSubmitAndNext = payload.payload;
		},
		triggerBackButtonTabEvent: (state, payload) => {
			state.backButtonClicked = payload.payload;
		},
		triggerPaymentRouteEvent: (state, payload) => {
			state.isPaymentRoute = payload.payload;
		},
		triggerApplicationDownloadEvent: (state, payload) => {
			state.isApplicationDownload = payload.payload;
		},
		setOtpOnForgotPassword: (state, payload) => {
			state.otp = payload.payload;
		},
		setEmailOnForgotPassword: (state, payload) => {
			state.email = payload.payload;
		}
	},


});

export const {
	showSpinner,hideSpinner,
	triggerSaveAndExitEvent,triggerSaveAndNextEvent,
	triggerBackButtonTabEvent,triggerPaymentRouteEvent,
	triggerApplicationDownloadEvent,setOtpOnForgotPassword,setEmailOnForgotPassword
} = globalSlice.actions;
export default globalSlice.reducer;
