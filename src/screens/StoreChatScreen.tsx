import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainStackParamList } from "../navigation/types";
import { useAppTheme } from "../theme/ThemeProvider";
import { useTranslations } from "../localization/LocalizationProvider";
import ScreenHeader from "../components/ScreenHeader";
import Text from "../components/Text";
import VerticalList from "../components/VerticalList";
import { useAuth } from "../auth/AuthProvider";
import { useSendSupportChatMessageMutation, useSupportChatMessagesQuery } from "../hooks/useSupportChat";
import { SupportChatMessage } from "../api/supportChatServiceTypes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SocketReceivedMessage, storeOrdersSocketClient } from "../socket/storeOrdersSocket";

type Props = NativeStackScreenProps<MainStackParamList, "StoreChat">;

export default function StoreChatScreen({ navigation, route }: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslations("app");
  const insets = useSafeAreaInsets();
  const { session } = useAuth();
  console.log("my session is :", session)
  const senderId = session.user?.id ?? "";
  const [chatBoxId, setChatBoxId] = useState(route.params.chatBoxId ?? null);
  const [input, setInput] = useState("");
  const [socketMessages, setSocketMessages] = useState<SupportChatMessage[]>([]);
  const listRef = useRef<any>(null);

  const receiverId = route.params.receiverId ?? null;
  const riderName = route.params.riderName ?? t("chat_store");

  useEffect(() => {
    console.log("[StoreChatScreen] sender profile/session", {
      senderId,
      sessionUser: session.user,
      profiles: session.profiles,
    });
  }, [senderId, session.profiles, session.user]);

  const {
    data: messages = [],
    isLoading,
    refetch,
    isRefetching,
  } = useSupportChatMessagesQuery({
    chatBoxId,
  });
  const sendMutation = useSendSupportChatMessageMutation();

  useEffect(() => {
    const unsubscribe = storeOrdersSocketClient.onReceiveMessage((message: SocketReceivedMessage) => {
      const isBetweenStoreAndRider =
        (message.sender === senderId && message.receiver === receiverId) ||
        (message.sender === receiverId && message.receiver === senderId);

      if (!isBetweenStoreAndRider) {
        return;
      }

      const nextMessage: SupportChatMessage = {
        id: `${message.sender}-${message.receiver}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        chatBoxId: chatBoxId ?? "",
        senderId: message.sender,
        receiverId: message.receiver,
        text: message.text,
        createdAt: new Date().toISOString(),
      };

      console.log("[StoreChatScreen] socket:receive-message", nextMessage);
      setSocketMessages((prev) => [...prev, nextMessage]);
      setTimeout(() => listRef.current?.scrollToEnd?.({ animated: true }), 50);
    });

    return unsubscribe;
  }, [chatBoxId, receiverId, senderId]);

  const mergedMessages = useMemo(
    () => {
      const byId = new Map<string, SupportChatMessage>();
      for (const item of messages) {
        byId.set(item.id, item);
      }
      for (const item of socketMessages) {
        byId.set(item.id, item);
      }

      return Array.from(byId.values()).sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    },
    [messages, socketMessages],
  );

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    if (!senderId) {
      Alert.alert(t("chat_sender_missing"));
      return;
    }
    if (!receiverId) {
      Alert.alert(t("chat_receiver_missing"));
      return;
    }

    try {
      console.log("[StoreChatScreen] send:start", {
        senderId,
        receiverId,
        chatBoxId,
        text,
      });

      const didEmit = storeOrdersSocketClient.sendMessage({
        sender: senderId,
        receiver: receiverId,
        text,
      });
      console.log("[StoreChatScreen] send:socketEmit", { didEmit });

      const response = await sendMutation.mutateAsync({
        senderId,
        receiverId,
        text,
      });

      const nextChatBoxId =
        String(response.chatBoxId ?? (response.data as { chatBoxId?: string } | undefined)?.chatBoxId ?? "").trim() || null;

      if (!chatBoxId && nextChatBoxId) {
        setChatBoxId(nextChatBoxId);
      }

      setInput("");
      setSocketMessages([]);
      await refetch();
      setTimeout(() => listRef.current?.scrollToEnd?.({ animated: true }), 50);
      listRef.current?.scrollToEnd?.({ animated: true });
    } catch (error) {
      console.log("[StoreChatScreen] send:error", error);
      Alert.alert(t("chat_send_failed"));
    }
  };

  const renderBubble = ({ item }: { item: SupportChatMessage }) => {
    const isMine = item.senderId === senderId;
    return (
      <View style={[styles.bubbleRow, isMine ? styles.bubbleRowMine : styles.bubbleRowOther]}>
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: isMine ? theme.colors.primary : "#F3F4F6",
            },
          ]}
        >
          <Text style={styles.bubbleText} color={theme.colors.gray900}>
            {item.text}
          </Text>
          <Text style={styles.timeText} color={theme.colors.gray600}>
            {formatTime(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScreenHeader title={riderName} onBack={() => navigation.goBack()} />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : (
        <VerticalList
          ref={listRef}
          data={mergedMessages}
          keyExtractor={(item) => item.id}
          renderItem={renderBubble}
          contentContainerStyle={styles.messagesContent}
          onRefresh={refetch}
          refreshing={isRefetching}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text color={theme.colors.gray500}>{t("chat_empty")}</Text>
            </View>
          }
        />
      )}

      <View
        style={[
          styles.inputBar,
          {
            borderTopColor: theme.colors.gray200,
            backgroundColor: theme.colors.background,
            paddingBottom: Math.max(insets.bottom + 5, 10),
          },
        ]}
      >
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder={t("chat_enter_concern")}
          placeholderTextColor={theme.colors.gray400}
          style={[styles.input, { borderColor: theme.colors.gray200, color: theme.colors.text }]}
          multiline
          maxLength={500}
        />
        <Pressable
          onPress={handleSend}
          disabled={sendMutation.isPending || input.trim().length === 0}
          style={[
            styles.sendBtn,
            { backgroundColor: theme.colors.primary },
            (sendMutation.isPending || input.trim().length === 0) && styles.sendBtnDisabled,
          ]}
        >
          {sendMutation.isPending ? (
            <ActivityIndicator size="small" color={theme.colors.gray900} />
          ) : (
            <Text weight="semiBold" color={theme.colors.gray900}>
              {t("chat_send")}
            </Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    paddingBottom: 24,
  },
  emptyWrap: {
    paddingTop: 80,
    alignItems: "center",
  },
  bubbleRow: {
    flexDirection: "row",
  },
  bubbleRowMine: {
    justifyContent: "flex-end",
  },
  bubbleRowOther: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "82%",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  timeText: {
    fontSize: 11,
    lineHeight: 14,
    textAlign: "right",
  },
  inputBar: {
    borderTopWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  sendBtn: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    opacity: 0.6,
  },
});
