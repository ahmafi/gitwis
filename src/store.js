import { configureStore } from '@reduxjs/toolkit';
import filesReducer from './features/files/filesSlice';

export default configureStore({
  reducer: {
    files: filesReducer,
  },
});
