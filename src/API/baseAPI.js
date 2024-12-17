import axios from 'axios'

const isRunningLocally = () => window.location.hostname === 'localhost';

const api = axios.create({
    headers : {
        'Content-Type':'application/json; charset=utf-8',
    }
})

api.interceptors.request.use(
    (config)=> {
        if(isRunningLocally()){
            config.headers['x-bypass-middleware']=true;
        }
        if(getCookie('token')!==""){
            config.headers['Authorization']=`Bearer ${getCookie('token')}`;
        }
        return config
    },(error)=>{
        return Promise.reject(error);
    }
)

export const createAPICall = async({ method , url, data , params , headers}) => {
    try{
        const response = await api({ method , url, data , params , headers})
        return response.data
    }catch(error){ 
        throw{
            response: error.response?.data || 'Unknown Error',
            statusCode: error.response?.status || 500,
            statusText: error.response?.statusText || 'Error',
        }
    }
}