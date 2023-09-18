import { createSlice } from '@reduxjs/toolkit'

const initialState={
     // #########################################################
    // #######################   YHA PHASOGE CHECK IT ##########
    // #########################################################
    // try to take user from localStorage if doesnt in local storage mark it null
    user :localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")):null,
    loading:false,

};
const profileSlice=createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{
        setUser(state,value){
                 state.user=value.payload 
        },
        setLoading(state, value) {
            state.loading = value.payload;
          },
    }
});

export const {setUser,setLoading}=profileSlice.actions;
export default profileSlice.reducer;