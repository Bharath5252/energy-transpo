import * as types from '../types';

const initialState = {
    isLoading: false,
    error: null,
    data: null,
    message: null,
    userDetails: {},
    snackBarStatus: {
        open: false,
        message: '',
        status: false,
    },
}

export const reducer = (state=initialState, action) => {
    if(/\/pending$/.test(action.type)){
        return{
            ...state,
            loading: true,
        }
    }
    switch(action.type){
        case `${types.POST_LOGIN_DETAILS}/fulfilled`:
            return{
                ...state,
                isLoading: false,
                snackBarStatus: {
                    open: true,
                    message: action.payload?.data?.message,
                    status: true,
                },
            }
        case `${types.POST_LOGIN_DETAILS}/rejected`:
            return{
                ...state,
                isLoading: false,
                snackBarStatus: {
                    open: true,
                    message: action.payload?.response?.message,
                    status: false,
                },
            }
        case `${types.POST_SIGNUP_DETAILS}/fulfilled`:
            return {
                ...state,
                isLoading: false,
                snackBarStatus: {
                    open: true,
                    message: action.payload?.data?.message,
                    status: true,
                },
            }
        case `${types.POST_SIGNUP_DETAILS}/rejected`:
            return{
                ...state,
                isLoading: false,
                snackBarStatus: {
                    open: true,
                    message: action.payload?.response?.message,
                    status: false,
                },
            }
        case `${types.GET_USER_DETAILS}/fulfilled`:
            return{
                ...state,
                isLoading: false,
                userDetails: action.payload?.data,
            }
        case `${types.GET_USER_DETAILS}/rejected`:
            return{
                ...state,
                isLoading: false,
                snackBarStatus: {
                    open: true,
                    message: action.payload?.response?.message,
                    status: false,
                },
            }
        case `${types.TOGGLE_SNACKBAR}`:
            return{
                ...state,
                isLoading: false,
                snackBarStatus: action.payload,
            }
        case `${types.GET_CAR_LIST}`:
            return{
                ...state,
                isLoading: false,
                carDetails: action.payload,
            }
        case `${types.POST_ADD_VEHICLE}/fulfilled`:
            return{
                ...state,
                isLoading: false,
                snackBarStatus: {
                    open: true,
                    message: action.payload?.data?.message,
                    status: true,
                },
            }
        case `${types.POST_ADD_VEHICLE}/rejected`:
            return{
                ...state,
                isLoading: false,
                snackBarStatus: {
                    open: true,
                    message: action.payload?.response?.message,
                    status: false,
                },
            }
        case `${types.POST_DELETE_VEHICLE}/fulfilled`:
            return{
                ...state,
                isLoading: false,
                snackBarStatus: {
                    open: true,
                    message: action.payload?.data?.message,
                    status: true,
                },
            }
        case `${types.POST_DELETE_VEHICLE}/rejected`:
            return{
                ...state,
                isLoading: false,
                snackBarStatus: {
                    open: true,
                    message: action.payload?.response?.message,
                    status: false,
                },
            }
        default :
        return{
            ...state,
            isLoading: false,
        }
    }
}