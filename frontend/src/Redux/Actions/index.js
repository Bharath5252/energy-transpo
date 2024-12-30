import { createAsyncThunk } from "@reduxjs/toolkit";
import {createAPICall} from "../../API/baseAPI";
import * as types from "../types";
import * as config from "../../config/config";
import {database,ref,get} from '../../database/firebase'

export const createApiThunk = (name, apiConfig) => {
    return createAsyncThunk(name, async(actionParams, thunkAPI)=>{
    try {
        const {params, data, ...otherParams} = actionParams || {};
        const response = await createAPICall({
            ...apiConfig,
            params: {...apiConfig.params, ...params},
            data: Array.isArray(apiConfig.data) || Array.isArray(data)
            ? [...(apiConfig.data || []), ...apiCall(data || [])]
            : {...apiConfig.data, ...data},
            file:{...apiConfig.body,...params},
            ...otherParams
        });
        return response;
    }catch (error){
        return thunkAPI.rejectWithValue(error);
    }});
};

export const postLoginDetails = createApiThunk(types.POST_LOGIN_DETAILS,{
    method:"POST",
    url:config.POST_LOGIN_DETAILS_URL
})
export const postSignUpDetails = createApiThunk(types.POST_SIGNUP_DETAILS,{
    method:"POST",
    url:config.POST_SIGNUP_DETAILS_URL
})

export const putSignUpDetails = createApiThunk(types.POST_SIGNUP_DETAILS,{
    method:"PUT",
    url:config.GET_LOGIN_DETAILS_URL
})

export const getUserDetails = createApiThunk(types.GET_USER_DETAILS,{
    method:"GET",
    url:config.GET_LOGIN_DETAILS_URL
})
export const postAddVehicle = createApiThunk(types.POST_ADD_VEHICLE,{
    method:"POST",
    url:config.POST_ADD_VEHICLE_URL
})
export const postDeleteVehicle = createApiThunk(types.POST_DELETE_VEHICLE,{
    method:"POST",
    url:config.POST_DELETE_VEHICLE_URL
})

export const toggleSnackbar = (payload) => {
    return{
        type:types.TOGGLE_SNACKBAR,
        payload
    }
}

export const carList = () => {
    return async (dispatch) =>{
        const carsRef = ref(database, 'cars_data');
        get(carsRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    dispatch({
                        type:types.GET_CAR_LIST,
                        payload:data
                    })
                } else {
                    dispatch({
                        type:types.GET_CAR_LIST,
                        payload:{}
                    })
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                dispatch({
                    type:types.GET_CAR_LIST,
                    payload:{}
                })
            });
            dispatch({
                type:types.GET_CAR_LIST,
                payload:{}
            })
    }
};