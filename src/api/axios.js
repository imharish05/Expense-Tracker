import axios from "axios"

const api = axios.create({
    
    baseURL: process.env.REACT_APP_API_URL
}
)

api.interceptors.request.use((config) => {
    console.log(process.env.REACT_APP_API_URL);
    const token = localStorage.getItem("token")

    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})


export default api;