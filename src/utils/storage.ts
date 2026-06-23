import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const Storage = {
	async getItemAsync(key: string): Promise<string | null> {
		if (Platform.OS === "web") {
			try {
				if (typeof window !== "undefined" && window.localStorage) {
					return window.localStorage.getItem(key);
				}
			} catch (e) {
				console.error("Erro ao ler do localStorage:", e);
			}
			return null;
		}
		return await SecureStore.getItemAsync(key);
	},

	async setItemAsync(key: string, value: string): Promise<void> {
		if (Platform.OS === "web") {
			try {
				if (typeof window !== "undefined" && window.localStorage) {
					window.localStorage.setItem(key, value);
				}
			} catch (e) {
				console.error("Erro ao salvar no localStorage:", e);
			}
			return;
		}
		await SecureStore.setItemAsync(key, value);
	},

	async deleteItemAsync(key: string): Promise<void> {
		if (Platform.OS === "web") {
			try {
				if (typeof window !== "undefined" && window.localStorage) {
					window.localStorage.removeItem(key);
				}
			} catch (e) {
				console.error("Erro ao deletar do localStorage:", e);
			}
			return;
		}
		await SecureStore.deleteItemAsync(key);
	},
};
