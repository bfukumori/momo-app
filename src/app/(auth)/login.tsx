import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { AlertCircle, Lock, Mail } from "lucide-react-native";
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
import { AnimatedButton } from "@/components/AnimatedButton";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginScreen() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const login = useAuthStore((state) => state.login);

	const fadeAnim = useRef(new Animated.Value(0)).current;
	const slideAnim = useRef(new Animated.Value(20)).current;
	const animationRef = useRef<LottieView>(null);

	useEffect(() => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 800,
				useNativeDriver: true,
			}),
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 800,
				useNativeDriver: true,
			}),
		]).start();
	}, [fadeAnim, slideAnim]);

	const handleLogin = async () => {
		setErrorMsg("");
		if (!email || !password) {
			setErrorMsg("Por favor, preencha todos os campos.");
			return;
		}

		try {
			setLoading(true);
			const response = await api.post("/api/v1/auth/login", {
				email,
				password,
			});
			await login(response.data.access_token);
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				const rawMessage = error.response?.data?.message;
				const displayError = Array.isArray(rawMessage)
					? rawMessage[0]
					: rawMessage || "Falha de ligação ao servidor.";
				setErrorMsg(displayError);
			}
		} finally {
			setLoading(false);
		}
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
					<View style={styles.header}>
						<LottieView
							ref={animationRef}
							source={require("../../../assets/animations/walking-cat.json")}
							autoPlay
							loop
							style={styles.lottieAnimation}
						/>
						<Text style={styles.title}>Momo App</Text>
						<Text style={styles.subtitle}>
							O seu progresso diário, gamificado.
						</Text>
					</View>

					{errorMsg ? (
						<View style={styles.errorBox}>
							<AlertCircle color="#FCA5A5" size={20} />
							<Text style={styles.errorText}>{errorMsg}</Text>
						</View>
					) : null}

					<View style={styles.inputGroup}>
						<Mail color="#94A3B8" size={20} style={styles.icon} />
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
						<Lock color="#94A3B8" size={20} style={styles.icon} />
						<TextInput
							style={styles.input}
							placeholder="Senha"
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
						title="Entrar"
						onPress={handleLogin}
						loading={loading}
						style={{ marginTop: 10 }}
					/>

					<TouchableOpacity
						style={styles.registerLink}
						onPress={() => router.push("/(auth)/register")}
					>
						<Text style={styles.registerText}>
							Ainda não tem conta?{" "}
							<Text style={styles.registerTextBold}>Registre-se</Text>
						</Text>
					</TouchableOpacity>
				</Animated.View>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0F172A",
		justifyContent: "center",
	},
	formContainer: { paddingHorizontal: 24 },
	header: { alignItems: "center", marginBottom: 40 },
	lottieAnimation: {
		width: 150,
		height: 150,
		marginBottom: -10,
	},
	title: {
		fontSize: 36,
		fontWeight: "800",
		color: "#F8FAFC",
		marginBottom: 8,
	},
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
	input: {
		flex: 1,
		fontSize: 16,
		color: "#F8FAFC",
		height: "100%",
	},

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

	registerLink: {
		marginTop: 24,
		alignItems: "center",
		paddingVertical: 10,
	},
	registerText: {
		color: "#94A3B8",
		fontSize: 15,
	},
	registerTextBold: {
		color: "#818CF8",
		fontWeight: "bold",
	},
});
