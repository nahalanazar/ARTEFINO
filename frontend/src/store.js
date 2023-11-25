import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './slices/apiSlice';
import userAuthReducer from './slices/userAuthSlice.js'
import adminAuthReducer from './slices/adminAuthSlice.js';


const store = configureStore({
    reducer: {
        userAuth: userAuthReducer,
        adminAuth: adminAuthReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})

export default store;



// 'userAuth' and 'adminAuth' is going to be the name of the state