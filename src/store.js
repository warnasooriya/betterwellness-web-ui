import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userReducer'


export const Store = configureStore({
  reducer: {
    userReducer: userReducer,
  },
})
