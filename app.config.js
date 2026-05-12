module.exports = {
  expo: {
    name: "EnategaDeliveriesStoreApp",
    slug: "enatega-deliveries-store-app",
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
      bundleIdentifier: "com.enatega.deliveries.store",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.enatega.deliveries.store",
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
        projectId: "5cf97681-9db5-457b-bf07-07c5ff3f3a9d",
      },
    },
  },
};
