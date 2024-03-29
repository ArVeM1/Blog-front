import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from "../../axios";

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const {data} = await axios.get('/posts')
  return data
})

export const fetchTags = createAsyncThunk('tags/fetchTags', async () => {
  const {data} = await axios.get('/tags')
  return data
})

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => {
  axios.delete(`/posts/${id}`)
})

const initialState = {
  posts: {
    items: [],
    status: 'loading',
  },
  tags: {
    items: [],
    status: 'loading',
  },
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: {
    // Get Post
    [fetchPosts.pending]: (state) => {
      state.posts.status = 'loading'
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },
    // Get Tags
    [fetchTags.pending]: (state) => {
      state.tags.status = 'loading'
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = 'loaded';
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = 'error';
    },
    // Remove Post
    [fetchRemovePost.pending]: (state, action) => {
      state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg)
    },
  }
})

export const postsRedusers =  postsSlice.reducer;