import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './reducers/data';

export const store = configureStore({
  reducer: {
    data: dataReducer,
  },
});

export default store;

