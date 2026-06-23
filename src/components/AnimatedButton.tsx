import { LinearGradient } from "expo-linear-gradient";
import { useRef } from "react";
import {
	ActivityIndicator,
	Animated,
	Pressable,
	StyleSheet,
	Text,
	type ViewStyle,
} from "react-native";

interface Props {
	title: string;
	onPress: () => void;
	loading?: boolean;
	style?: ViewStyle;
}

export function AnimatedButton({ title, onPress, loading, style }: Props) {
	const scaleAnim = useRef(new Animated.Value(1)).current;

	const handlePressIn = () => {
		Animated.spring(scaleAnim, {
			toValue: 0.95,
			useNativeDriver: true,
		}).start();
	};

	const handlePressOut = () => {
		Animated.spring(scaleAnim, {
			toValue: 1,
			friction: 4,
			useNativeDriver: true,
		}).start();
	};

	return (
		<Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
			<Pressable
				onPress={onPress}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				disabled={loading}
			>
				<LinearGradient
					colors={["#4F46E5", "#4338CA"]}
					style={styles.gradient}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
				>
					{loading ? (
						<ActivityIndicator color="#fff" />
					) : (
						<Text style={styles.text}>{title}</Text>
					)}
				</LinearGradient>
			</Pressable>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	gradient: {
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#4F46E5",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 5,
	},
	text: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "700",
		letterSpacing: 0.5,
	},
});
