import { configureStore } from '@reduxjs/toolkit';
import { postsRedusers } from "./slices/posts";
import { authRedusers } from "./slices/auth";


const store = configureStore({
  reducer: {
    posts: postsRedusers,
    auth: authRedusers,
  }
});

export default store;



