import Axios from 'axios'

const URL = window.location.origin.includes('localhost') ? `http://localhost:9000/api` : "/api"

const axios = Axios.create({
    baseURL: URL,
})

export default axios