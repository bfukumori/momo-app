import { useQuery } from "@tanstack/react-query";
import {
	Beef,
	ChevronLeft,
	ChevronRight,
	Droplet,
	Dumbbell,
	Pill,
	Trophy,
} from "lucide-react-native";
import { useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { api } from "@/services/api";

interface DailyLog {
	id: string;
	date: string;
	waterConsumedMl: number;
	proteinConsumedG: number;
	didExercise: boolean;
	tookMedication: boolean;
	pointsEarned: number;
}

export default function HistoryScreen() {
	const [currentDate, setCurrentDate] = useState(new Date());

	const year = currentDate.getFullYear();
	const month = currentDate.getMonth() + 1;

	const { data: logs, isLoading } = useQuery({
		queryKey: ["monthlyLogs", year, month],
		queryFn: async () => {
			const { data } = await api.get<DailyLog[]>("/api/v1/daily-logs", {
				params: { year, month },
			});
			return data;
		},
	});

	const handlePrevMonth = () => setCurrentDate(new Date(year, month - 2, 1));
	const handleNextMonth = () => setCurrentDate(new Date(year, month, 1));

	const formatMonthName = (date: Date) => {
		return date.toLocaleString("pt-PT", { month: "long", year: "numeric" });
	};

	const renderLogCard = ({ item }: { item: DailyLog }) => {
		const day = item.date.split("-")[2];

		return (
			<View style={styles.card}>
				<View style={styles.cardHeader}>
					<View style={styles.dateBadge}>
						<Text style={styles.dateText}>Dia {day}</Text>
					</View>
					<View style={styles.pointsBadge}>
						<Trophy color="#FBBF24" size={16} />
						<Text style={styles.pointsText}>+{item.pointsEarned}</Text>
					</View>
				</View>

				<View style={styles.metricsRow}>
					<View style={styles.metric}>
						<Droplet color="#60A5FA" size={20} />
						<Text style={styles.metricText}>{item.waterConsumedMl}ml</Text>
					</View>
					<View style={styles.metric}>
						<Beef color="#F472B6" size={20} />
						<Text style={styles.metricText}>{item.proteinConsumedG}g</Text>
					</View>
					{item.didExercise && (
						<View style={[styles.habitBadge, { backgroundColor: "#166534" }]}>
							<Dumbbell color="#4ADE80" size={16} />
						</View>
					)}
					{item.tookMedication && (
						<View style={[styles.habitBadge, { backgroundColor: "#701A75" }]}>
							<Pill color="#F0ABFC" size={16} />
						</View>
					)}
				</View>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Histórico Diário</Text>

			<View style={styles.monthSelector}>
				<TouchableOpacity onPress={handlePrevMonth} style={styles.navBtn}>
					<ChevronLeft color="#F8FAFC" size={24} />
				</TouchableOpacity>
				<Text style={styles.monthText}>{formatMonthName(currentDate)}</Text>
				<TouchableOpacity
					onPress={handleNextMonth}
					style={styles.navBtn}
					disabled={new Date() < new Date(year, month, 1)}
				>
					<ChevronRight
						color={
							new Date() < new Date(year, month, 1) ? "#334155" : "#F8FAFC"
						}
						size={24}
					/>
				</TouchableOpacity>
			</View>

			{isLoading ? (
				<ActivityIndicator
					size="large"
					color="#818CF8"
					style={{ marginTop: 40 }}
				/>
			) : logs && logs.length > 0 ? (
				<FlatList
					data={logs}
					keyExtractor={(item) => item.id}
					renderItem={renderLogCard}
					contentContainerStyle={{ paddingBottom: 100 }}
					showsVerticalScrollIndicator={false}
				/>
			) : (
				<View style={styles.emptyState}>
					<Text style={styles.emptyText}>Não há registos para este mês.</Text>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0F172A",
		paddingHorizontal: 20,
		paddingTop: 60,
	},
	title: {
		fontSize: 28,
		fontWeight: "800",
		color: "#F8FAFC",
		marginBottom: 24,
	},

	monthSelector: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#1E293B",
		borderRadius: 16,
		padding: 8,
		marginBottom: 24,
	},
	navBtn: { padding: 8 },
	monthText: {
		fontSize: 18,
		color: "#F8FAFC",
		fontWeight: "600",
		textTransform: "capitalize",
	},

	emptyState: { alignItems: "center", marginTop: 40 },
	emptyText: { color: "#64748B", fontSize: 16 },

	card: {
		backgroundColor: "#1E293B",
		borderRadius: 20,
		padding: 20,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "#334155",
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	dateBadge: {
		backgroundColor: "#334155",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 8,
	},
	dateText: { color: "#F8FAFC", fontWeight: "bold" },
	pointsBadge: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#422006",
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 8,
	},
	pointsText: { color: "#FBBF24", fontWeight: "bold", marginLeft: 6 },

	metricsRow: { flexDirection: "row", alignItems: "center", gap: 16 },
	metric: { flexDirection: "row", alignItems: "center", gap: 6 },
	metricText: { color: "#CBD5E1", fontSize: 16, fontWeight: "500" },
	habitBadge: { padding: 8, borderRadius: 10 },
});
