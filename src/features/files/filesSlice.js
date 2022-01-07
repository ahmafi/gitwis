import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDirectory } from '../../api/git-providers/gitwis/gitwis';

const initialState = {
  currentPath: '/',
  '/': {
    status: 'idle',
  }
};

export const fetchDirectory = createAsyncThunk(
  'files/fetchDirectory',
  async (path) => {
    return await getDirectory(path)
  },
);

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchDirectory.pending, (state, action) => {
        state[action.meta.arg] = {
          status: 'pending'
        }
      })
      .addCase(fetchDirectory.fulfilled, (state, action) => {
        state[action.meta.arg].filesList = action.payload;
        state[action.meta.arg].status = 'fulfilled';
        state.currentPath = action.meta.arg;
      });
  },
});

export default filesSlice.reducer;
