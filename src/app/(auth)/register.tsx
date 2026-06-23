import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { AlertCircle, ArrowLeft, Lock, Mail, User } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
	Animated,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import Toast from "react-native-toast-message";
import { AnimatedButton } from "@/components/AnimatedButton";
import { api } from "@/services/api";

interface CreateUserDto {
	name: string;
	email: string;
	password: string;
}

export default function RegisterScreen() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMsg, setErrorMsg] = useState("");

	const fadeAnim = useRef(new Animated.Value(0)).current;
	const slideAnim = useRef(new Animated.Value(20)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 600,
				useNativeDriver: true,
			}),
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 600,
				useNativeDriver: true,
			}),
		]).start();
	}, [fadeAnim, slideAnim]);

	const registerMutation = useMutation({
		mutationFn: (data: CreateUserDto) => api.post("/api/v1/users", data),
		onSuccess: () => {
			Toast.show({
				type: "success",
				text1: "Conta Criada!",
				text2: "Bem-vindo(a) ao Momo App. Faça login para começar.",
			});
			router.replace("/(auth)/login");
		},
		onError: (error: unknown) => {
			const axiosError = error as {
				response?: { data?: { message?: string | string[] } };
			};
			const rawMessage = axiosError.response?.data?.message;
			const displayError = Array.isArray(rawMessage)
				? rawMessage[0]
				: rawMessage || "Falha ao criar conta.";
			setErrorMsg(displayError);
		},
	});

	const handleRegister = () => {
		setErrorMsg("");
		if (!name || !email || !password) {
			setErrorMsg("Por favor, preencha todos os campos.");
			return;
		}
		registerMutation.mutate({ name, email, password });
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.container}
			>
				<Animated.View
					style={[
						styles.formContainer,
						{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
					]}
				>
					<TouchableOpacity
						onPress={() => router.back()}
						style={styles.backBtn}
					>
						<ArrowLeft color="#94A3B8" size={24} />
					</TouchableOpacity>

					<View style={styles.header}>
						<Text style={styles.title}>Criar conta</Text>
						<Text style={styles.subtitle}>
							Inicie a sua jornada de evolução.
						</Text>
					</View>

					{errorMsg ? (
						<View style={styles.errorBox}>
							<AlertCircle color="#EF4444" size={20} />
							<Text style={styles.errorText}>{errorMsg}</Text>
						</View>
					) : null}

					<View style={styles.inputGroup}>
						<User color="#64748B" size={20} style={styles.icon} />
						<TextInput
							style={styles.input}
							placeholder="Nome de exibição"
							placeholderTextColor="#64748B"
							value={name}
							onChangeText={(text) => {
								setName(text);
								setErrorMsg("");
							}}
						/>
					</View>

					<View style={styles.inputGroup}>
						<Mail color="#64748B" size={20} style={styles.icon} />
						<TextInput
							style={styles.input}
							placeholder="Email"
							placeholderTextColor="#64748B"
							value={email}
							onChangeText={(text) => {
								setEmail(text);
								setErrorMsg("");
							}}
							autoCapitalize="none"
							keyboardType="email-address"
						/>
					</View>

					<View style={styles.inputGroup}>
						<Lock color="#64748B" size={20} style={styles.icon} />
						<TextInput
							style={styles.input}
							placeholder="Senha (mínimo 8 caracteres)"
							placeholderTextColor="#64748B"
							value={password}
							onChangeText={(text) => {
								setPassword(text);
								setErrorMsg("");
							}}
							secureTextEntry
						/>
					</View>

					<AnimatedButton
						title="Registrar"
						onPress={handleRegister}
						loading={registerMutation.isPending}
						style={{ marginTop: 10 }}
					/>
				</Animated.View>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#0F172A", justifyContent: "center" },
	formContainer: { paddingHorizontal: 24 },
	backBtn: {
		marginBottom: 20,
		alignSelf: "flex-start",
		padding: 8,
		backgroundColor: "#1E293B",
		borderRadius: 12,
	},
	header: { marginBottom: 32 },
	title: { fontSize: 32, fontWeight: "800", color: "#F8FAFC", marginBottom: 8 },
	subtitle: { fontSize: 16, color: "#94A3B8" },
	inputGroup: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#1E293B",
		borderRadius: 12,
		marginBottom: 16,
		paddingHorizontal: 16,
		borderWidth: 1,
		borderColor: "#334155",
		height: 56,
	},
	icon: { marginRight: 12 },
	input: { flex: 1, fontSize: 16, color: "#F8FAFC", height: "100%" },
	errorBox: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#450A0A",
		padding: 12,
		borderRadius: 8,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "#7F1D1D",
	},
	errorText: { color: "#FCA5A5", marginLeft: 8, fontSize: 14, flex: 1 },
});
