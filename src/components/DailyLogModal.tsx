import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
	Modal,
	ScrollView,
	StyleSheet,
	Switch,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Toast from "react-native-toast-message";
import { api } from "../services/api";
import { AnimatedButton } from "./AnimatedButton";

interface Props {
	visible: boolean;
	onClose: () => void;
	targets: { waterMl: number; proteinGrams: number };
	currentProgress?: { waterConsumedMl: number; proteinConsumedG: number };
}

interface CreateDailyLogDto {
	date: string;
	waterConsumedMl: number;
	proteinConsumedG: number;
	medication?: string;
	tookMedication: boolean;
	didExercise: boolean;
	weight?: number;
	sideEffects?: string;
}

export function DailyLogModal({
	visible,
	onClose,
	targets,
	currentProgress,
}: Props) {
	const [water, setWater] = useState("");
	const [protein, setProtein] = useState("");
	const [didExercise, setDidExercise] = useState(false);
	const [tookMedication, setTookMedication] = useState(false);

	const queryClient = useQueryClient();

	useEffect(() => {
		if (visible) {
			setWater(
				currentProgress?.waterConsumedMl
					? String(currentProgress.waterConsumedMl)
					: "0",
			);
			setProtein(
				currentProgress?.proteinConsumedG
					? String(currentProgress.proteinConsumedG)
					: "0",
			);
		}
	}, [visible, currentProgress]);

	const addWater = (amount: number) => {
		const current = Number(water) || 0;
		setWater(String(current + amount));
	};

	const mutation = useMutation({
		mutationFn: (data: CreateDailyLogDto) =>
			api.post("/api/v1/daily-logs", data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["userProfile"] });
			queryClient.invalidateQueries({ queryKey: ["monthlyLogs"] });
			onClose();

			if (variables.waterConsumedMl >= targets.waterMl) {
				setTimeout(
					() =>
						Toast.show({
							type: "success",
							text1: "🌊 Meta de Água Atingida!",
							text2: "Excelente hidratação hoje!",
						}),
					500,
				);
			}
			if (variables.proteinConsumedG >= targets.proteinGrams) {
				setTimeout(
					() =>
						Toast.show({
							type: "success",
							text1: "💪 Meta de Proteína Atingida!",
							text2: "Os seus músculos agradecem!",
						}),
					1500,
				);
			}
			Toast.show({
				type: "info",
				text1: "Registo Salvo",
				text2: "Pontos adicionados ao seu saldo!",
			});
		},
		onError: () =>
			Toast.show({
				type: "error",
				text1: "Erro",
				text2: "Falha ao salvar o registro diário.",
			}),
	});

	const handleSave = () => {
		mutation.mutate({
			date: new Date().toISOString().split("T")[0],
			waterConsumedMl: Number(water) || 0,
			proteinConsumedG: Number(protein) || 0,
			didExercise,
			tookMedication,
		});
	};

	return (
		<Modal visible={visible} animationType="slide" transparent>
			<View style={styles.overlay}>
				<View style={styles.card}>
					<ScrollView showsVerticalScrollIndicator={false}>
						<Text style={styles.title}>Registro Diário</Text>

						<Text style={styles.label}>Água Consumida Hoje (ml)</Text>

						<View style={styles.quickAddContainer}>
							<TouchableOpacity
								style={styles.chip}
								onPress={() => addWater(250)}
								activeOpacity={0.7}
							>
								<Plus color="#60A5FA" size={16} />
								<Text style={styles.chipText}>Copo 250ml</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.chip}
								onPress={() => addWater(500)}
								activeOpacity={0.7}
							>
								<Plus color="#60A5FA" size={16} />
								<Text style={styles.chipText}>Garrafa 500ml</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.chip}
								onPress={() => addWater(750)}
								activeOpacity={0.7}
							>
								<Plus color="#60A5FA" size={16} />
								<Text style={styles.chipText}>Garrafa 750ml</Text>
							</TouchableOpacity>
						</View>

						<TextInput
							style={styles.input}
							value={water}
							onChangeText={setWater}
							keyboardType="numeric"
							placeholder="Ex: 2500"
							placeholderTextColor="#475569"
						/>

						<Text style={styles.label}>Proteína Consumida (g)</Text>
						<TextInput
							style={styles.input}
							value={protein}
							onChangeText={setProtein}
							keyboardType="numeric"
							placeholder="Ex: 120"
							placeholderTextColor="#475569"
						/>

						<View style={styles.switchRow}>
							<Text style={styles.labelSwitch}>Fez Exercício?</Text>
							<Switch
								value={didExercise}
								onValueChange={setDidExercise}
								trackColor={{ true: "#6366F1", false: "#334155" }}
							/>
						</View>

						<View style={styles.switchRow}>
							<Text style={styles.labelSwitch}>Tomou a Medicação?</Text>
							<Switch
								value={tookMedication}
								onValueChange={setTookMedication}
								trackColor={{ true: "#6366F1", false: "#334155" }}
							/>
						</View>

						<View style={styles.row}>
							<TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
								<Text style={styles.cancelText}>Cancelar</Text>
							</TouchableOpacity>
							<AnimatedButton
								title="Registrar"
								onPress={handleSave}
								loading={mutation.isPending}
								style={{ flex: 1 }}
							/>
						</View>
					</ScrollView>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.7)",
		justifyContent: "flex-end",
	},
	card: {
		backgroundColor: "#1E293B",
		padding: 24,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		maxHeight: "90%",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#F8FAFC",
		marginBottom: 20,
	},
	label: { color: "#94A3B8", marginBottom: 8 },
	labelSwitch: { color: "#F8FAFC", fontSize: 16, fontWeight: "500" },
	input: {
		backgroundColor: "#0F172A",
		color: "#F8FAFC",
		padding: 16,
		borderRadius: 12,
		marginBottom: 20,
		fontSize: 16,
	},

	quickAddContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
		marginBottom: 12,
	},
	chip: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#0F172A",
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "#1E3A8A",
	},
	chipText: {
		color: "#60A5FA",
		fontWeight: "600",
		marginLeft: 4,
		fontSize: 13,
	},

	switchRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
		backgroundColor: "#0F172A",
		padding: 16,
		borderRadius: 12,
	},
	row: { flexDirection: "row", gap: 12, marginTop: 10, paddingBottom: 20 },
	cancelBtn: {
		flex: 1,
		padding: 16,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#334155",
	},
	cancelText: { color: "#F8FAFC", fontWeight: "bold" },
});
