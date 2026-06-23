import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import {
	Beef,
	CalendarDays,
	Droplet,
	LogOut,
	Plus,
	Settings,
	Trophy,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	Animated,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { DailyLogModal } from "@/components/DailyLogModal";
import { EditTargetsModal } from "@/components/EditTargetsModal";
import { ProgressBar } from "@/components/ProgressBar";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";

const fetchProfile = async () => {
	const { data } = await api.get("/api/v1/users/me");
	return data;
};

export default function DashboardScreen() {
	const router = useRouter();
	const logout = useAuthStore((state) => state.logout);
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const animationRef = useRef<LottieView>(null);

	const [targetsModalVisible, setTargetsModalVisible] = useState(false);
	const [logModalVisible, setLogModalVisible] = useState(false);

	const {
		data: profile,
		isLoading,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ["userProfile"],
		queryFn: fetchProfile,
	});

	useEffect(() => {
		if (profile) {
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 600,
				useNativeDriver: true,
			}).start();
		}
	}, [profile, fadeAnim]);

	if (isLoading)
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size={40} />
				<Text style={styles.loadingText}>Carregando o seu perfil...</Text>
			</View>
		);

	return (
		<>
			<ScrollView
				style={styles.container}
				refreshControl={
					<RefreshControl
						refreshing={isRefetching}
						onRefresh={refetch}
						tintColor="#818CF8"
					/>
				}
			>
				<Animated.View style={{ opacity: fadeAnim, paddingBottom: 100 }}>
					<View style={styles.header}>
						<View>
							<View style={styles.greetingContainer}>
								<Text style={styles.greeting}>Olá, {profile?.name}</Text>
								<LottieView
									ref={animationRef}
									source={require("../../../assets/animations/cat-animation.json")}
									autoPlay
									loop
									style={styles.lottieAnimation}
								/>
							</View>
							<Text style={styles.subGreeting}>Pronto para evoluir hoje?</Text>
						</View>
						<TouchableOpacity onPress={logout} style={styles.logoutBtn}>
							<LogOut color="#FCA5A5" size={22} />
						</TouchableOpacity>
					</View>

					<View style={styles.scoreCard}>
						<View style={styles.scoreHeader}>
							<Trophy color="#FBBF24" size={28} />
							<Text style={styles.scoreTitle}>Nível Atual (Pontos)</Text>
						</View>
						<Text style={styles.points}>
							{profile?.totalPoints} <Text style={styles.ptsText}>pts</Text>
						</Text>
					</View>

					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Metas Diárias</Text>
						<TouchableOpacity
							onPress={() => setTargetsModalVisible(true)}
							style={styles.editBtn}
						>
							<Settings color="#818CF8" size={20} />
						</TouchableOpacity>
					</View>

					<View style={styles.statsGrid}>
						<View style={styles.statCard}>
							<View style={styles.cardHeader}>
								<View
									style={[styles.iconContainer, { backgroundColor: "#1E3A8A" }]}
								>
									<Droplet color="#60A5FA" size={24} />
								</View>
								<Text style={styles.statLabel}>Água (ml)</Text>
							</View>
							<ProgressBar
								current={profile?.todayProgress?.waterConsumedMl || 0}
								target={profile?.targets.waterMl || 2000}
								fillColor="#60A5FA"
							/>
						</View>

						<View style={styles.statCard}>
							<View style={styles.cardHeader}>
								<View
									style={[styles.iconContainer, { backgroundColor: "#831843" }]}
								>
									<Beef color="#F472B6" size={24} />
								</View>
								<Text style={styles.statLabel}>Proteína (g)</Text>
							</View>
							<ProgressBar
								current={profile?.todayProgress?.proteinConsumedG || 0}
								target={profile?.targets.proteinGrams || 150}
								fillColor="#F472B6"
							/>
						</View>
					</View>
					<TouchableOpacity
						style={styles.historyBtn}
						onPress={() => router.push("/(app)/history")}
						activeOpacity={0.8}
					>
						<CalendarDays color="#818CF8" size={24} />
						<Text style={styles.historyBtnText}>Ver Histórico Mensal</Text>
					</TouchableOpacity>
				</Animated.View>
			</ScrollView>

			<TouchableOpacity
				style={styles.fab}
				onPress={() => setLogModalVisible(true)}
				activeOpacity={0.8}
			>
				<Plus color="#FFFFFF" size={32} />
			</TouchableOpacity>

			{profile && (
				<>
					<EditTargetsModal
						visible={targetsModalVisible}
						onClose={() => setTargetsModalVisible(false)}
						currentWater={profile.targets.waterMl}
						currentProtein={profile.targets.proteinGrams}
					/>
					<DailyLogModal
						visible={logModalVisible}
						onClose={() => setLogModalVisible(false)}
						targets={profile.targets}
						currentProgress={profile.todayProgress}
					/>
				</>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#0F172A", paddingHorizontal: 20 },
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#0F172A",
	},
	loadingText: { fontSize: 16, color: "#94A3B8", marginTop: 12 },

	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 60,
		marginBottom: 32,
	},
	lottieAnimation: {
		width: 60,
		height: 60,
	},
	greetingContainer: { flexDirection: "row", alignItems: "center" },
	greeting: { fontSize: 26, fontWeight: "800", color: "#F8FAFC" },
	subGreeting: { fontSize: 15, color: "#94A3B8", marginTop: 4 },
	logoutBtn: { padding: 10, backgroundColor: "#450A0A", borderRadius: 14 },

	scoreCard: {
		backgroundColor: "#1E293B",
		padding: 24,
		borderRadius: 24,
		alignItems: "center",
		marginBottom: 32,
		borderWidth: 1,
		borderColor: "#334155",
	},
	scoreHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
	scoreTitle: {
		fontSize: 16,
		color: "#CBD5E1",
		fontWeight: "600",
		marginLeft: 8,
	},
	points: { fontSize: 52, fontWeight: "900", color: "#F8FAFC" },
	ptsText: { fontSize: 20, color: "#64748B", fontWeight: "600" },

	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	sectionTitle: { fontSize: 20, fontWeight: "700", color: "#F8FAFC" },
	editBtn: { padding: 8, backgroundColor: "#1E293B", borderRadius: 10 },

	statsGrid: { flexDirection: "column", gap: 16 },
	statCard: {
		backgroundColor: "#1E293B",
		padding: 20,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "#334155",
	},
	cardHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
	iconContainer: {
		width: 48,
		height: 48,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
	},
	statLabel: { fontSize: 16, color: "#94A3B8", fontWeight: "600" },
	statValue: { fontSize: 22, fontWeight: "800", color: "#F8FAFC" },
	unit: { fontSize: 14, color: "#64748B", fontWeight: "600" },

	fab: {
		position: "absolute",
		bottom: 30,
		right: 24,
		backgroundColor: "#6366F1",
		width: 64,
		height: 64,
		borderRadius: 32,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#6366F1",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.5,
		shadowRadius: 12,
		elevation: 10,
	},
	historyBtn: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#1E293B",
		padding: 18,
		borderRadius: 20,
		marginTop: 24,
		borderWidth: 1,
		borderColor: "#334155",
	},
	historyBtnText: {
		color: "#F8FAFC",
		fontSize: 16,
		fontWeight: "600",
		marginLeft: 12,
	},
});
