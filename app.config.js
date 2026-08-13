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
        NSBluetoothAlwaysUsageDescription:
          "Cylia Merchant uses Bluetooth to connect to receipt printers.",
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
      permissions: [
        "ACCESS_FINE_LOCATION",
        "android.permission.BLUETOOTH",
        "android.permission.BLUETOOTH_ADMIN",
        "android.permission.BLUETOOTH_SCAN",
        "android.permission.BLUETOOTH_CONNECT",
      ],
      edgeToEdgeEnabled: false,
    },
    androidNavigationBar: {
      backgroundColor: "#1F2937",
      barStyle: "dark-content",
      visible: "visible",
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
        "expo-navigation-bar",
        {
          backgroundColor: "#1F2937",
          barStyle: "dark",
          borderColor: "#1F2937",
          visibility: "visible",
          behavior: "inset-swipe",
          position: "relative",
        },
      ],
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
