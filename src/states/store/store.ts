import userSlice from "../slices/userSlice";
import { configureStore } from "@reduxjs/toolkit";
import expenseSlice from "../slices/expenseSlice";
export const store = configureStore({
  reducer: {
    user: userSlice,
    expense: expenseSlice,
  },
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
