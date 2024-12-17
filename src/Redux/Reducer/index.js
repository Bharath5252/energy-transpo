import * as types from '../types';

const initialState = {
    isLoading: false,
    error: null,
    data: null,
    message: null,
}

export const reducer = (state=initialState, action) => {
    if(/\/pending$/.test(action.type)){
        return{
            ...state,
            loading: true,
        }
    }
    switch(action.type){
        case `${types.POST_LOGIN_DETAILS}_FULFILLED`:
            return{
                ...state,
                isLoading: false,
                data: action.payload,
            }
        default :
        return{
            ...state,
            isLoading: false,
        }
    }
}