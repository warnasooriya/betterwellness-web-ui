import { createSlice } from '@reduxjs/toolkit'

const specializationReducer = createSlice({
    name: 'specializationReducer',
    initialState: {
        specializations: [],
    },
    reducers: {

        setSpecializations(state, action) {
            state.specializations = action.payload;
        },
    },
})

export const { setSpecializations } = specializationReducer.actions


export default specializationReducer.reducer