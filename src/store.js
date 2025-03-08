import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userReducer'
import availabilityReducer from './reducers/availabilityReducer'


export const Store = configureStore({
  reducer: {
    userReducer: userReducer,
    availabilityReducer: availabilityReducer,
  },
})
