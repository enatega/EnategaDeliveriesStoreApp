module.exports = {
  expo: {
    name: "Shaaneiol Store",
    slug: "shaaneiol-store",

  version: "1.0.5",
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
      bundleIdentifier: "com.shaaneiol.store",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.shaaneiol.store",
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    updates: {
      url: "https://u.expo.dev/5cf97681-9db5-457b-bf07-07c5ff3f3a9d",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    plugins: ["expo-secure-store", "expo-font"],
    extra: {
      eas: {
        projectId: "bcc60324-a0f4-4a82-8440-7235083d272c"
      },
    },
  },
};
