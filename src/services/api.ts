import axios from "axios";
import { Storage } from "../utils/storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:3000";

export const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use(
	async (config) => {
		const token = await Storage.getItemAsync("access_token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401) {
			await Storage.deleteItemAsync("access_token");
		}
		return Promise.reject(error);
	},
);
