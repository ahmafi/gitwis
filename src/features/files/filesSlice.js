import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPath: '/',
  '/': {
    status: 'idle',
  }
};

export const fetchDirectory = createAsyncThunk(
  'files/fetchDirectory',
  async (path) => {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `#graphql
          query GetFiles($path: String!) {
            files(path: $path) {
              name
              extension
              size
              isDir
              dirFileCount
            }
          }
        `,
        variables: {
          path,
        },
      }),
    });
    const responseJSON = await response.json();
    return responseJSON.data.files;
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
