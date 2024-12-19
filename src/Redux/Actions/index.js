import { createAsyncThunk } from "@reduxjs/toolkit";
import {createAPICall} from "../../API/baseAPI";
import * as types from "../types";
import * as config from "../../config/config";

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

export const getUserDetails = createApiThunk(types.GET_USER_DETAILS,{
    method:"GET",
    url:config.GET_LOGIN_DETAILS_URL

})