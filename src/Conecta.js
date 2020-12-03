import axios from 'axios'

const Conecta = axios.create({baseURL: 'http://187.52.54.51/edecio/academia/'})

export default Conecta