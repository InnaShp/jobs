import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://jsearch.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY as string,
    'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
  },
});
