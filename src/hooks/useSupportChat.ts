import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { ApiError } from "../api/apiClient";
import { supportChatKeys } from "../api/queryKeys";
import { supportChatService } from "../api/supportChatService";
import {
  SendSupportChatMessageRequest,
  SendSupportChatMessageResponse,
  SupportChatMessage,
} from "../api/supportChatServiceTypes";

type UseSupportChatMessagesOptions = {
  chatBoxId?: string | null;
} & Omit<UseQueryOptions<SupportChatMessage[], ApiError>, "queryKey" | "queryFn">;

export function useSupportChatMessagesQuery({
  chatBoxId,
  ...options
}: UseSupportChatMessagesOptions) {
  return useQuery<SupportChatMessage[], ApiError>({
    queryKey: supportChatKeys.messagesByChatBox(chatBoxId ?? "unknown"),
    queryFn: () => supportChatService.getMessages(chatBoxId as string),
    enabled: Boolean(chatBoxId),
    staleTime: 30 * 1000,
    ...options,
  });
}

export function useSendSupportChatMessageMutation(
  options?: UseMutationOptions<SendSupportChatMessageResponse, ApiError, SendSupportChatMessageRequest>,
) {
  return useMutation<SendSupportChatMessageResponse, ApiError, SendSupportChatMessageRequest>({
    mutationFn: (data) => supportChatService.sendMessage(data),
    ...options,
  });
}
