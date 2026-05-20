import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, Image, StyleSheet, Text, View } from "react-native";

type Props = {
  onFinish?: () => void;
};

export default function SplashScreen({ onFinish }: Props) {
  const redOverlayOpacity = useRef(new Animated.Value(1)).current;
  const stripExpandProgress = useRef(new Animated.Value(0)).current;
  const stripOpacity = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get("window").width;
  const stripWidth = stripExpandProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [200, screenWidth],
  });
  const totalDurationMs = 2500;
  const redToWhiteDelayMs = 450;
  const redToWhiteDurationMs = 650;
  const stripExpandDelayMs = 420;
  const stripFadeInDurationMs = 160;
  const stripExpandDurationMs = 450;

  useEffect(() => {
    const overlayAnimation = Animated.sequence([
      Animated.delay(redToWhiteDelayMs),
      Animated.timing(redOverlayOpacity, {
        toValue: 0,
        duration: redToWhiteDurationMs,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }),
    ]);

    const stripAnimation = Animated.sequence([
      Animated.delay(redToWhiteDelayMs + redToWhiteDurationMs + stripExpandDelayMs),
      Animated.parallel([
        Animated.timing(stripOpacity, {
          toValue: 1,
          duration: stripFadeInDurationMs,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(stripExpandProgress, {
          toValue: 1,
          duration: stripExpandDurationMs,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
      ]),
    ]);

    const timer = setTimeout(() => {
      onFinish?.();
    }, totalDurationMs);

    overlayAnimation.start();
    stripAnimation.start();

    return () => {
      overlayAnimation.stop();
      stripAnimation.stop();
      clearTimeout(timer);
    };
  }, [onFinish, redOverlayOpacity, stripOpacity, stripExpandProgress]);

  return (
    <View style={styles.container}>
      <View style={styles.whiteLayer} />
      <Animated.View
        pointerEvents="none"
        style={[styles.redLayer, { opacity: redOverlayOpacity }]}
      />

      <View style={styles.centerContent}>
        <Image
          source={require("../../assets/splash-icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Animated.View
        style={[
          styles.storeAppStrip,
          {
            opacity: stripOpacity,
            width: stripWidth,
          },
        ]}
      >
        <Text style={styles.storeAppText}>Store App</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  whiteLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#E5E5E5",
  },
  redLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#CE2E40",
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 92,
  },
  logo: {
    width: 150,
    height: 150,
  },
  storeAppStrip: {
    position: "absolute",
    top: "58%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#A87A52",
  },
  storeAppText: {
    color: "#FFFFFF",
    fontSize: 24,
    lineHeight: 24,
    fontWeight: "700",
  },
});
