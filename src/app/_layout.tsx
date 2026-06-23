import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	DarkTheme,
	Slot,
	ThemeProvider,
	useRouter,
	useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
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

const InitialLayout = () => {
	const { isAuthenticated, isHydrated, checkAuth } = useAuthStore();
	const segments = useSegments();
	const router = useRouter();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	useEffect(() => {
		if (!isHydrated) return;

		const inAuthGroup = segments[0] === "(auth)";

		if (!isAuthenticated && !inAuthGroup) {
			router.replace("/(auth)/login");
		} else if (isAuthenticated && inAuthGroup) {
			router.replace("/(app)/dashboard");
		}
	}, [isAuthenticated, isHydrated, segments, router]);

	return <Slot />;
};

export default function RootLayout() {
	return (
		<ThemeProvider value={AppDarkTheme}>
			<QueryClientProvider client={queryClient}>
				<InitialLayout />
				<StatusBar style="light" />
				<Toast />
			</QueryClientProvider>
		</ThemeProvider>
	);
}
