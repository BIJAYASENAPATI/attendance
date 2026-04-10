// import { configureStore } from "@reduxjs/toolkit";
// import { productsApi } from "./service/slice";

// export const store = configureStore({
//     reducer: {
//         [productsApi.reducerPath]: productsApi.reducer,
//     },
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware().concat(productsApi.middleware),
// });


import { configureStore } from '@reduxjs/toolkit';
import { productsApi } from './service/slice';

const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
});

export default store;