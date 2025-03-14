import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userReducer'
import availabilityReducer from './reducers/availabilityReducer'
import specializationReducer from './reducers/specializationReducer'
import messageReducer from './reducers/messageReducer'


export const Store = configureStore({
  reducer: {
    userReducer: userReducer,
    availabilityReducer: availabilityReducer,
    specializationReducer: specializationReducer,
    messageReducer: messageReducer,
  },
})
