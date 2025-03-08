import axios from 'axios'
import config from './config'

export default axios.create()

export const axiosPrivate = axios.create({
    // baseURL: config.counsellorServiceBaseUrl,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
}
)
