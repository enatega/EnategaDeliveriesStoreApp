module.exports = {
  expo: {
    name: "Cylia Merchant",
    slug: "cylia-merchant",
    owner: "cylia-platform",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.cyliaplatform.merchant",
      infoPlist: {
        UIBackgroundModes: ["audio"],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      googleServicesFile: "./google-services.json",
      package: "com.cyliaplatform.merchant",
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    updates: {
      url: "https://u.expo.dev/b07f9587-5655-42f0-bfdb-e6245945d94e",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    plugins: [
      "expo-secure-store",
      "expo-font",
      [
        "expo-notifications",
        {
          sounds: ["./src/assets/sound/beep3.mp3"],
        },
      ],
    ],
    extra: {
      eas: {
        projectId: "b07f9587-5655-42f0-bfdb-e6245945d94e",
      },
    },
  },
};
