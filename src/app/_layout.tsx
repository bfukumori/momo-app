import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkTheme, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@/store/useAuthStore";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 2,
			staleTime: 1000 * 60 * 5,
		},
	},
});

const AppDarkTheme = {
	...DarkTheme,
	colors: {
		...DarkTheme.colors,
		background: "#0F172A",
	},
};

const RootNavigation = () => {
	const { isAuthenticated, isHydrated, checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (!isHydrated) {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: "#0F172A",
					justifyContent: "center",
				}}
			>
				<ActivityIndicator size="large" color="#ffffff" />
			</View>
		);
	}

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Protected guard={!isAuthenticated}>
				<Stack.Screen name="(auth)" />
			</Stack.Protected>

			<Stack.Protected guard={isAuthenticated}>
				<Stack.Screen name="(app)" />
			</Stack.Protected>
		</Stack>
	);
};

export default function RootLayout() {
	return (
		<ThemeProvider value={AppDarkTheme}>
			<QueryClientProvider client={queryClient}>
				<RootNavigation />
				<StatusBar style="light" />
				<Toast />
			</QueryClientProvider>
		</ThemeProvider>
	);
}
