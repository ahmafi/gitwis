import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { getDirectory } from '../../api/git-providers/gitwis/gitwis';

const initialState = {
  currentPath: '/',
  '/': {
    status: 'idle',
  },
};

export const fetchDirectory = createAsyncThunk(
  'files/fetchDirectory',
  async (path) => {
    return await getDirectory(path);
  }
);

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchDirectory.pending, (state, action) => {
        state[action.meta.arg] = {
          status: 'pending',
        };
      })
      .addCase(fetchDirectory.fulfilled, (state, action) => {
        state[action.meta.arg].filesList = action.payload;
        state[action.meta.arg].status = 'fulfilled';
        state.currentPath = action.meta.arg;
      });
  },
});

export default filesSlice.reducer;

export const selectCurrentFiles = (state, currentPath) =>
  state.files[currentPath].filesList;

export const selectCurrentFilesSorted = createSelector(
  [selectCurrentFiles],
  (files) => {
    const newFiles = files.slice();
    newFiles.sort((firstEl, secondEl) => {
      if (
        !secondEl.isDir ||
        secondEl.name.toLowerCase() > firstEl.name.toLowerCase()
      ) {
        return -1;
      }
      return 0;
    });
    return newFiles;
  }
);
