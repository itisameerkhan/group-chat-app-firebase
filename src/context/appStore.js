import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";

const appStore = configureStore({
  reducer: {
    userSlice: userSlice,
  },
});

export default appStore;