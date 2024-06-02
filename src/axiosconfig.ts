import axios from 'axios';

// Configura la instancia de Axios
const axiosInstance = axios.create({
  baseURL: 'http://34.116.158.34', // Cambia esta URL a la base de tu API
  timeout: 100000, // Puedes ajustar el tiempo de espera según tus necesidades
  headers: {
    'Content-Type': 'application/json',
  },
});

// Puedes agregar interceptores si lo necesitas
axiosInstance.interceptors.request.use(
  (config) => {
    // Agrega lógica antes de enviar la petición, como incluir tokens de autenticación
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Procesa la respuesta antes de resolverla
    return response;
  },
  (error) => {
    // Maneja errores de respuesta
    return Promise.reject(error);
  }
);

export default axiosInstance;
