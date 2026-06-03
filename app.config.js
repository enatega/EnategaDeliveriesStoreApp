module.exports = {
  expo: {
    name: "EatMile Store",
    slug: "eatmile-store",
    owner: "ninjas_code",
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
      bundleIdentifier: "com.eatmile.store",
      googleServicesFile: "./GoogleService-Info.plist",
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
      package: "com.eatmile.store",
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    updates: {
      url: "https://u.expo.dev/b5571cc2-e82c-4d16-903f-a966fdd922fc",
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
        projectId: "b5571cc2-e82c-4d16-903f-a966fdd922fc",
      },
    },
  },
};
