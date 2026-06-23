import { create } from "zustand";
import { Storage } from "../utils/storage";

interface AuthState {
	isAuthenticated: boolean;
	isHydrated: boolean;
	login: (token: string) => Promise<void>;
	logout: () => Promise<void>;
	checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
	isAuthenticated: false,
	isHydrated: false,

	checkAuth: async () => {
		try {
			const token = await Storage.getItemAsync("access_token");
			set({ isAuthenticated: !!token, isHydrated: true });
		} catch (error) {
			console.error(error);
			set({ isAuthenticated: false, isHydrated: true });
		}
	},

	login: async (token: string) => {
		await Storage.setItemAsync("access_token", token);
		set({ isAuthenticated: true });
	},

	logout: async () => {
		await Storage.deleteItemAsync("access_token");
		set({ isAuthenticated: false });
	},
}));
