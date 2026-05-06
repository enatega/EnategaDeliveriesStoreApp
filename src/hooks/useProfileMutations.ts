import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { profileService } from '../api/profileServices';
import { ApiError } from '../api/apiClient';
import {
    UpdateAvailabilityRequest,
    UpdateAvailabilityResponse,
    UpdateWorkScheduleRequest,
    UpdateWorkScheduleResponse,
    UpdateLanguageRequest,
    UpdateLanguageResponse,
    UpdateBankManagementRequest,
    UpdateBankManagementResponse,
    AvailabilityResponse,
} from '../api/profileServicesTypes';
import { profileKeys } from '../api/queryKeys';

// ─── Update Availability ─────────────────────────────────────────

export function useUpdateAvailability(
  options?: UseMutationOptions<UpdateAvailabilityResponse, ApiError, UpdateAvailabilityRequest>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => profileService.updateAvailability(data),
    onMutate: async (newData) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: profileKeys.availability() });

      // Snapshot previous value for rollback
      const previous = queryClient.getQueryData<AvailabilityResponse>(profileKeys.availability());

      // Optimistically update the cache
      queryClient.setQueryData<AvailabilityResponse>(profileKeys.availability(), (old) => ({
        ...old,
        store_id: old?.store_id ?? '',
        store_available: newData.storeAvailable,
      }));

      return { previous };
    },
    onError: (error, variables, context) => {
      // Rollback to the previous value on error
      if (context?.previous) {
        queryClient.setQueryData(profileKeys.availability(), context.previous);
      }
      options?.onError?.(error, variables, context);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure server state
      queryClient.invalidateQueries({ queryKey: profileKeys.availability() });
      options?.onSettled?.();
    },
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

// ─── Update Work Schedule ────────────────────────────────────────
export function useUpdateWorkSchedule(
    options?: UseMutationOptions<UpdateWorkScheduleResponse, ApiError, UpdateWorkScheduleRequest>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => profileService.updateWorkSchedule(data),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: profileKeys.workSchedule() });
            options?.onSuccess?.(data, variables, context);
        },
        ...options,
    });
}

// ─── Update Language ─────────────────────────────────────────────
export function useUpdateLanguage(
    options?: UseMutationOptions<UpdateLanguageResponse, ApiError, UpdateLanguageRequest>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => profileService.updateLanguage(data),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: profileKeys.language() });
            // Optionally also invalidate full profile if language is part of it
            queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
            options?.onSuccess?.(data, variables, context);
        },
        ...options,
    });
}

// ─── Update Bank Management ──────────────────────────────────────
export function useUpdateBankManagement(
    options?: UseMutationOptions<UpdateBankManagementResponse, ApiError, UpdateBankManagementRequest>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => profileService.updateBankManagement(data),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: profileKeys.bankManagement() });
            options?.onSuccess?.(data, variables, context);
        },
        ...options,
    });
}