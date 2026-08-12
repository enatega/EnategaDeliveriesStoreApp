import { useState } from "react";
import { getExpoPushTokenForAuth } from "../api/expoPushNotification";

export function useExpoPushToken() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getExpoPushToken = async () => {
    if (expoPushToken) {
      return expoPushToken;
    }

    setIsLoading(true);

    try {
      const token = await getExpoPushTokenForAuth();

      console.log("[EXPO PUSH TOKEN][STORE]", token);
      setExpoPushToken(token);
      return token;
    } catch (error) {
      console.log("[EXPO PUSH TOKEN ERROR][STORE]", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    expoPushToken,
    getExpoPushToken,
    isLoading,
  };
}
