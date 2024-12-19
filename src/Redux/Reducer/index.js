import * as types from '../types';

const initialState = {
    isLoading: false,
    error: null,
    data: null,
    message: null,
    userDetails: [],
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
                data: action.payload,
            }
        case `${types.GET_USER_DETAILS}/fulfilled`:
            return{
                ...state,
                isLoading: false,
                userDetails: action.payload,
            }
        case `${types.GET_USER_DETAILS}/rejected`:
            return{
                ...state,
                isLoading: false,
                userDetails: action.payload,
            }
        default :
        return{
            ...state,
            isLoading: false,
        }
    }
}