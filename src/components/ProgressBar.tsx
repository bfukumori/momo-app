import { CheckCircle2 } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface ProgressBarProps {
	current: number;
	target: number;
	fillColor: string;
}

export function ProgressBar({ current, target, fillColor }: ProgressBarProps) {
	const safeTarget = target > 0 ? target : 1;
	const rawPercentage = Math.round((current / safeTarget) * 100);
	const clampedPercentage = Math.min(rawPercentage, 100);
	const isGoalReached = current >= target;

	const animatedWidth = useRef(new Animated.Value(0)).current;
	const badgeScale = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.timing(animatedWidth, {
			toValue: clampedPercentage,
			duration: 800,
			useNativeDriver: false,
		}).start();

		if (isGoalReached) {
			Animated.spring(badgeScale, {
				toValue: 1,
				friction: 5,
				tension: 40,
				useNativeDriver: true,
			}).start();
		} else {
			badgeScale.setValue(0);
		}
	}, [clampedPercentage, isGoalReached, animatedWidth, badgeScale]);

	const widthInterpolated = animatedWidth.interpolate({
		inputRange: [0, 100],
		outputRange: ["0%", "100%"],
	});

	return (
		<View style={styles.container}>
			<View style={styles.textRow}>
				<Text style={styles.progressText}>
					{current} <Text style={styles.targetText}>/ {target}</Text>
				</Text>

				<View style={styles.percentageContainer}>
					{isGoalReached && (
						<Animated.View
							style={{ transform: [{ scale: badgeScale }], marginRight: 6 }}
						>
							<CheckCircle2 color="#4ADE80" size={18} />
						</Animated.View>
					)}
					<Text
						style={[
							styles.percentageText,
							{ color: isGoalReached ? "#4ADE80" : fillColor },
						]}
					>
						{rawPercentage}%
					</Text>
				</View>
			</View>

			<View style={styles.track}>
				<Animated.View
					style={[
						styles.fill,
						{
							backgroundColor: isGoalReached ? "#4ADE80" : fillColor,
							width: widthInterpolated,
						},
					]}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { width: "100%", marginTop: 12 },
	textRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-end",
		marginBottom: 8,
	},
	progressText: { fontSize: 16, fontWeight: "700", color: "#F8FAFC" },
	targetText: { fontSize: 14, color: "#64748B", fontWeight: "500" },

	percentageContainer: { flexDirection: "row", alignItems: "center" },
	percentageText: { fontSize: 16, fontWeight: "800" },

	track: {
		height: 8,
		backgroundColor: "#334155",
		borderRadius: 4,
		overflow: "hidden",
	},
	fill: { height: "100%", borderRadius: 4 },
});
