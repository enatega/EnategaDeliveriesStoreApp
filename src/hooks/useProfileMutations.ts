import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { profileService } from '../api/profileServices';
import { ApiError } from '../api/apiClient';
import {
    ProfileResponse,
    UpdateAvailabilityRequest,
    UpdateAvailabilityResponse,
    UpdateInstantDeliveryRequest,
    UpdateInstantDeliveryResponse,
    UpdateWorkScheduleRequest,
    UpdateWorkScheduleResponse,
    UpdateLanguageRequest,
    UpdateLanguageResponse,
    UpdateBankManagementRequest,
    UpdateBankManagementResponse,
    AvailabilityResponse,
    UpdateProfileInfoRequest,
    UpdateProfileInfoResponse,
} from '../api/profileServicesTypes';
import { profileKeys } from '../api/queryKeys';

// ─── Update Availability ─────────────────────────────────────────

export function useUpdateAvailability(
  options?: UseMutationOptions<UpdateAvailabilityResponse, ApiError, UpdateAvailabilityRequest>
) {
  const queryClient = useQueryClient();
  const { onError, onMutate: _ignoredOnMutate, onSuccess, onSettled, ...restOptions } = options ?? {};

  return useMutation<
    UpdateAvailabilityResponse,
    ApiError,
    UpdateAvailabilityRequest,
    { previous: AvailabilityResponse | undefined }
  >({
    mutationFn: (data: UpdateAvailabilityRequest) => profileService.updateAvailability(data),
    onMutate: async (newData): Promise<{ previous: AvailabilityResponse | undefined }> => {
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
    onError: (error, variables, onMutateResult, context) => {
      // Rollback to the previous value on error
      if (onMutateResult?.previous) {
        queryClient.setQueryData(profileKeys.availability(), onMutateResult.previous);
      }
      onError?.(error, variables, onMutateResult, context);
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      // Re-apply the successful value to avoid stale refetch flicker.
      queryClient.setQueryData<AvailabilityResponse>(profileKeys.availability(), (old) => ({
        ...old,
        store_id: old?.store_id ?? data.store_id ?? '',
        store_available: variables.storeAvailable,
      }));
      onSuccess?.(data, variables, onMutateResult, context);
    },
    onSettled: (data, error, variables, onMutateResult, context) => {
      // Refetch in background to sync eventual server state.
      queryClient.invalidateQueries({
        queryKey: profileKeys.availability(),
        refetchType: 'inactive',
      });
      onSettled?.(data, error, variables, onMutateResult, context);
    },
    ...restOptions,
  });
}

// ─── Update Instant Delivery ─────────────────────────────────────

export function useUpdateInstantDelivery(
  options?: UseMutationOptions<UpdateInstantDeliveryResponse, ApiError, UpdateInstantDeliveryRequest>
) {
  const queryClient = useQueryClient();
  const { onError, onMutate: _ignoredOnMutate, onSuccess, onSettled, ...restOptions } = options ?? {};

  return useMutation<
    UpdateInstantDeliveryResponse,
    ApiError,
    UpdateInstantDeliveryRequest,
    { previous: ProfileResponse | undefined }
  >({
    mutationFn: (data: UpdateInstantDeliveryRequest) => profileService.updateInstantDelivery(data),
    onMutate: async (newData): Promise<{ previous: ProfileResponse | undefined }> => {
      await queryClient.cancelQueries({ queryKey: profileKeys.profile() });

      const previous = queryClient.getQueryData<ProfileResponse>(profileKeys.profile());

      queryClient.setQueryData<ProfileResponse>(profileKeys.profile(), (old) =>
        old
          ? {
              ...old,
              profile: {
                ...old.profile,
                isInstantDelivery: newData.isInstantDelivery,
                instantDeliveryTime: newData.instantDeliveryTime,
              },
            }
          : old
      );

      return { previous };
    },
    onError: (error, variables, onMutateResult, context) => {
      if (onMutateResult?.previous) {
        queryClient.setQueryData(profileKeys.profile(), onMutateResult.previous);
      }
      onError?.(error, variables, onMutateResult, context);
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.setQueryData<ProfileResponse>(profileKeys.profile(), (old) =>
        old
          ? {
              ...old,
              profile: {
                ...old.profile,
                isInstantDelivery: variables.isInstantDelivery,
                instantDeliveryTime: variables.instantDeliveryTime,
              },
            }
          : old
      );
      onSuccess?.(data, variables, onMutateResult, context);
    },
    onSettled: (data, error, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.profile(),
        refetchType: 'inactive',
      });
      onSettled?.(data, error, variables, onMutateResult, context);
    },
    ...restOptions,
  });
}

// ─── Update Work Schedule ────────────────────────────────────────
export function useUpdateWorkSchedule(
    options?: UseMutationOptions<UpdateWorkScheduleResponse, ApiError, UpdateWorkScheduleRequest>
) {
    const queryClient = useQueryClient();
    const { onSuccess, ...restOptions } = options ?? {};

    return useMutation({
        mutationFn: (data) => profileService.updateWorkSchedule(data),
        onSuccess: (data, variables, onMutateResult, context) => {
            queryClient.invalidateQueries({ queryKey: profileKeys.workSchedule() });
            onSuccess?.(data, variables, onMutateResult, context);
        },
        ...restOptions,
    });
}

// ─── Update Language ─────────────────────────────────────────────
export function useUpdateLanguage(
    options?: UseMutationOptions<UpdateLanguageResponse, ApiError, UpdateLanguageRequest>
) {
    const queryClient = useQueryClient();
    const { onSuccess, ...restOptions } = options ?? {};

    return useMutation({
        mutationFn: (data) => profileService.updateLanguage(data),
        onSuccess: (data, variables, onMutateResult, context) => {
            queryClient.invalidateQueries({ queryKey: profileKeys.language() });
            // Optionally also invalidate full profile if language is part of it
            queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
            onSuccess?.(data, variables, onMutateResult, context);
        },
        ...restOptions,
    });
}

// ─── Update Bank Management ──────────────────────────────────────
export function useUpdateBankManagement(
    options?: UseMutationOptions<UpdateBankManagementResponse, ApiError, UpdateBankManagementRequest>
) {
    const queryClient = useQueryClient();
    const { onSuccess, ...restOptions } = options ?? {};

    return useMutation({
        mutationFn: (data) => profileService.updateBankManagement(data),
        onSuccess: (data, variables, onMutateResult, context) => {
            queryClient.invalidateQueries({ queryKey: profileKeys.bankManagement() });
            onSuccess?.(data, variables, onMutateResult, context);
        },
        ...restOptions,
    });
}

// ─── Update Profile Info (Address / Phone) ──────────────────────
export function useUpdateProfileInfo(
    options?: UseMutationOptions<UpdateProfileInfoResponse, ApiError, UpdateProfileInfoRequest>
) {
    const queryClient = useQueryClient();
    const { onSuccess, ...restOptions } = options ?? {};

    return useMutation({
        mutationFn: (data) => profileService.updateProfileInfo(data),
        onSuccess: (data, variables, onMutateResult, context) => {
            queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
            onSuccess?.(data, variables, onMutateResult, context);
        },
        ...restOptions,
    });
}
