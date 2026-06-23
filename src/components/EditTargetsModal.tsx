import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
	Modal,
	StyleSheet,
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
	currentWater: number;
	currentProtein: number;
}

export function EditTargetsModal({
	visible,
	onClose,
	currentWater,
	currentProtein,
}: Props) {
	const [water, setWater] = useState(String(currentWater));
	const [protein, setProtein] = useState(String(currentProtein));
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (data: { targetWaterMl: number; targetProteinGrams: number }) =>
			api.patch("/api/v1/users/me/targets", data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["userProfile"] });
			Toast.show({
				type: "success",
				text1: "Metas Atualizadas! 🎯",
				text2: "Os seus novos objetivos foram guardados.",
			});
			onClose();
		},
		onError: () => {
			Toast.show({
				type: "error",
				text1: "Erro",
				text2: "Não foi possível atualizar as metas.",
			});
		},
	});

	const handleSave = () => {
		mutation.mutate({
			targetWaterMl: Number(water),
			targetProteinGrams: Number(protein),
		});
	};

	return (
		<Modal visible={visible} animationType="slide" transparent>
			<View style={styles.overlay}>
				<View style={styles.card}>
					<Text style={styles.title}>Editar Metas</Text>

					<Text style={styles.label}>Água (ml)</Text>
					<TextInput
						style={styles.input}
						value={water}
						onChangeText={setWater}
						keyboardType="numeric"
					/>

					<Text style={styles.label}>Proteína (g)</Text>
					<TextInput
						style={styles.input}
						value={protein}
						onChangeText={setProtein}
						keyboardType="numeric"
					/>

					<View style={styles.row}>
						<TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
							<Text style={styles.cancelText}>Cancelar</Text>
						</TouchableOpacity>
						<AnimatedButton
							title="Guardar"
							onPress={handleSave}
							loading={mutation.isPending}
							style={{ flex: 1 }}
						/>
					</View>
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
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#F8FAFC",
		marginBottom: 20,
	},
	label: { color: "#94A3B8", marginBottom: 8 },
	input: {
		backgroundColor: "#0F172A",
		color: "#F8FAFC",
		padding: 16,
		borderRadius: 12,
		marginBottom: 16,
		fontSize: 16,
	},
	row: { flexDirection: "row", gap: 12, marginTop: 10 },
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
