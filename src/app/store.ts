import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import globalReducer from '../features/global/globalSlice';
import authReducer from '@Src/features/auth/authSlice';
import rootReducer from './admin/redux/actions/rootReducer';

export const store = configureStore({
	reducer: {
		global: globalReducer,
		auth: authReducer,
		...rootReducer	
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;