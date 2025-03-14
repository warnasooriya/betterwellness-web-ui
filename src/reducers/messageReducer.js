import { createSlice } from '@reduxjs/toolkit'

const messageReducer = createSlice({
    name: 'messageReducer',
    initialState: {
        messages: [],
        unreadCount: 0,
    },
    reducers: {
        setMessagesRed(state, action) {
            state.messages = action.payload;
        },
        setMessageRed(state, action) {
            state.messages = [...state.messages, action.payload];
            state.unreadCount += 1;
        },
        setLocalMsgs(state, action) {
            state.messages = [...state.messages, action.payload];
        }
    },
})

export const { setMessagesRed,setMessageRed ,setLocalMsgs} = messageReducer.actions


export default messageReducer.reducer