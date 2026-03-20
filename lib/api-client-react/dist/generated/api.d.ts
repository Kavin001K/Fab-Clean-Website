import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AuthResponse, ContactRequest, ErrorResponse, HealthStatus, OrderDetailResponse, OrderTrackResponse, OrdersResponse, PricingResponse, ProfileResponse, RefreshResponse, SchedulePickupRequest, SchedulePickupResponse, SendOtpRequest, SendOtpResponse, ServiceDetailResponse, ServicesResponse, SuccessResponse, TrackOrderParams, UpdateProfileRequest, VerifyOtpRequest } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all services
 */
export declare const getListServicesUrl: () => string;
export declare const listServices: (options?: RequestInit) => Promise<ServicesResponse>;
export declare const getListServicesQueryKey: () => readonly ["/api/services"];
export declare const getListServicesQueryOptions: <TData = Awaited<ReturnType<typeof listServices>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listServices>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listServices>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListServicesQueryResult = NonNullable<Awaited<ReturnType<typeof listServices>>>;
export type ListServicesQueryError = ErrorType<unknown>;
/**
 * @summary List all services
 */
export declare function useListServices<TData = Awaited<ReturnType<typeof listServices>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listServices>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get a service by slug
 */
export declare const getGetServiceUrl: (slug: string) => string;
export declare const getService: (slug: string, options?: RequestInit) => Promise<ServiceDetailResponse>;
export declare const getGetServiceQueryKey: (slug: string) => readonly [`/api/services/${string}`];
export declare const getGetServiceQueryOptions: <TData = Awaited<ReturnType<typeof getService>>, TError = ErrorType<ErrorResponse>>(slug: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getService>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getService>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetServiceQueryResult = NonNullable<Awaited<ReturnType<typeof getService>>>;
export type GetServiceQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get a service by slug
 */
export declare function useGetService<TData = Awaited<ReturnType<typeof getService>>, TError = ErrorType<ErrorResponse>>(slug: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getService>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get all pricing tables
 */
export declare const getListPricingUrl: () => string;
export declare const listPricing: (options?: RequestInit) => Promise<PricingResponse>;
export declare const getListPricingQueryKey: () => readonly ["/api/pricing"];
export declare const getListPricingQueryOptions: <TData = Awaited<ReturnType<typeof listPricing>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPricing>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPricing>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPricingQueryResult = NonNullable<Awaited<ReturnType<typeof listPricing>>>;
export type ListPricingQueryError = ErrorType<unknown>;
/**
 * @summary Get all pricing tables
 */
export declare function useListPricing<TData = Awaited<ReturnType<typeof listPricing>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPricing>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Schedule a pickup
 */
export declare const getSchedulePickupUrl: () => string;
export declare const schedulePickup: (schedulePickupRequest: SchedulePickupRequest, options?: RequestInit) => Promise<SchedulePickupResponse>;
export declare const getSchedulePickupMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof schedulePickup>>, TError, {
        data: BodyType<SchedulePickupRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof schedulePickup>>, TError, {
    data: BodyType<SchedulePickupRequest>;
}, TContext>;
export type SchedulePickupMutationResult = NonNullable<Awaited<ReturnType<typeof schedulePickup>>>;
export type SchedulePickupMutationBody = BodyType<SchedulePickupRequest>;
export type SchedulePickupMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Schedule a pickup
 */
export declare const useSchedulePickup: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof schedulePickup>>, TError, {
        data: BodyType<SchedulePickupRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof schedulePickup>>, TError, {
    data: BodyType<SchedulePickupRequest>;
}, TContext>;
/**
 * @summary Submit contact form
 */
export declare const getSubmitContactUrl: () => string;
export declare const submitContact: (contactRequest: ContactRequest, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getSubmitContactMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitContact>>, TError, {
        data: BodyType<ContactRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof submitContact>>, TError, {
    data: BodyType<ContactRequest>;
}, TContext>;
export type SubmitContactMutationResult = NonNullable<Awaited<ReturnType<typeof submitContact>>>;
export type SubmitContactMutationBody = BodyType<ContactRequest>;
export type SubmitContactMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Submit contact form
 */
export declare const useSubmitContact: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitContact>>, TError, {
        data: BodyType<ContactRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof submitContact>>, TError, {
    data: BodyType<ContactRequest>;
}, TContext>;
/**
 * @summary Send OTP to phone number
 */
export declare const getSendOtpUrl: () => string;
export declare const sendOtp: (sendOtpRequest: SendOtpRequest, options?: RequestInit) => Promise<SendOtpResponse>;
export declare const getSendOtpMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendOtp>>, TError, {
        data: BodyType<SendOtpRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof sendOtp>>, TError, {
    data: BodyType<SendOtpRequest>;
}, TContext>;
export type SendOtpMutationResult = NonNullable<Awaited<ReturnType<typeof sendOtp>>>;
export type SendOtpMutationBody = BodyType<SendOtpRequest>;
export type SendOtpMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Send OTP to phone number
 */
export declare const useSendOtp: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendOtp>>, TError, {
        data: BodyType<SendOtpRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof sendOtp>>, TError, {
    data: BodyType<SendOtpRequest>;
}, TContext>;
/**
 * @summary Verify OTP and authenticate
 */
export declare const getVerifyOtpUrl: () => string;
export declare const verifyOtp: (verifyOtpRequest: VerifyOtpRequest, options?: RequestInit) => Promise<AuthResponse>;
export declare const getVerifyOtpMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof verifyOtp>>, TError, {
        data: BodyType<VerifyOtpRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof verifyOtp>>, TError, {
    data: BodyType<VerifyOtpRequest>;
}, TContext>;
export type VerifyOtpMutationResult = NonNullable<Awaited<ReturnType<typeof verifyOtp>>>;
export type VerifyOtpMutationBody = BodyType<VerifyOtpRequest>;
export type VerifyOtpMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Verify OTP and authenticate
 */
export declare const useVerifyOtp: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof verifyOtp>>, TError, {
        data: BodyType<VerifyOtpRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof verifyOtp>>, TError, {
    data: BodyType<VerifyOtpRequest>;
}, TContext>;
/**
 * @summary Refresh access token
 */
export declare const getRefreshTokenUrl: () => string;
export declare const refreshToken: (options?: RequestInit) => Promise<RefreshResponse>;
export declare const getRefreshTokenMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof refreshToken>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof refreshToken>>, TError, void, TContext>;
export type RefreshTokenMutationResult = NonNullable<Awaited<ReturnType<typeof refreshToken>>>;
export type RefreshTokenMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Refresh access token
 */
export declare const useRefreshToken: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof refreshToken>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof refreshToken>>, TError, void, TContext>;
/**
 * @summary Logout and invalidate token
 */
export declare const getLogoutUrl: () => string;
export declare const logout: (options?: RequestInit) => Promise<SuccessResponse>;
export declare const getLogoutMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
export type LogoutMutationResult = NonNullable<Awaited<ReturnType<typeof logout>>>;
export type LogoutMutationError = ErrorType<unknown>;
/**
 * @summary Logout and invalidate token
 */
export declare const useLogout: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
/**
 * @summary List user orders
 */
export declare const getListOrdersUrl: () => string;
export declare const listOrders: (options?: RequestInit) => Promise<OrdersResponse>;
export declare const getListOrdersQueryKey: () => readonly ["/api/orders"];
export declare const getListOrdersQueryOptions: <TData = Awaited<ReturnType<typeof listOrders>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListOrdersQueryResult = NonNullable<Awaited<ReturnType<typeof listOrders>>>;
export type ListOrdersQueryError = ErrorType<unknown>;
/**
 * @summary List user orders
 */
export declare function useListOrders<TData = Awaited<ReturnType<typeof listOrders>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get order by ID
 */
export declare const getGetOrderUrl: (id: string) => string;
export declare const getOrder: (id: string, options?: RequestInit) => Promise<OrderDetailResponse>;
export declare const getGetOrderQueryKey: (id: string) => readonly [`/api/orders/${string}`];
export declare const getGetOrderQueryOptions: <TData = Awaited<ReturnType<typeof getOrder>>, TError = ErrorType<ErrorResponse>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetOrderQueryResult = NonNullable<Awaited<ReturnType<typeof getOrder>>>;
export type GetOrderQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get order by ID
 */
export declare function useGetOrder<TData = Awaited<ReturnType<typeof getOrder>>, TError = ErrorType<ErrorResponse>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Track order by phone and reference
 */
export declare const getTrackOrderUrl: (params: TrackOrderParams) => string;
export declare const trackOrder: (params: TrackOrderParams, options?: RequestInit) => Promise<OrderTrackResponse>;
export declare const getTrackOrderQueryKey: (params?: TrackOrderParams) => readonly ["/api/orders/track", ...TrackOrderParams[]];
export declare const getTrackOrderQueryOptions: <TData = Awaited<ReturnType<typeof trackOrder>>, TError = ErrorType<ErrorResponse>>(params: TrackOrderParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof trackOrder>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof trackOrder>>, TError, TData> & {
    queryKey: QueryKey;
};
export type TrackOrderQueryResult = NonNullable<Awaited<ReturnType<typeof trackOrder>>>;
export type TrackOrderQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Track order by phone and reference
 */
export declare function useTrackOrder<TData = Awaited<ReturnType<typeof trackOrder>>, TError = ErrorType<ErrorResponse>>(params: TrackOrderParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof trackOrder>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get user profile
 */
export declare const getGetProfileUrl: () => string;
export declare const getProfile: (options?: RequestInit) => Promise<ProfileResponse>;
export declare const getGetProfileQueryKey: () => readonly ["/api/users/profile"];
export declare const getGetProfileQueryOptions: <TData = Awaited<ReturnType<typeof getProfile>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProfile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getProfile>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetProfileQueryResult = NonNullable<Awaited<ReturnType<typeof getProfile>>>;
export type GetProfileQueryError = ErrorType<unknown>;
/**
 * @summary Get user profile
 */
export declare function useGetProfile<TData = Awaited<ReturnType<typeof getProfile>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProfile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update user profile
 */
export declare const getUpdateProfileUrl: () => string;
export declare const updateProfile: (updateProfileRequest: UpdateProfileRequest, options?: RequestInit) => Promise<ProfileResponse>;
export declare const getUpdateProfileMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProfile>>, TError, {
        data: BodyType<UpdateProfileRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateProfile>>, TError, {
    data: BodyType<UpdateProfileRequest>;
}, TContext>;
export type UpdateProfileMutationResult = NonNullable<Awaited<ReturnType<typeof updateProfile>>>;
export type UpdateProfileMutationBody = BodyType<UpdateProfileRequest>;
export type UpdateProfileMutationError = ErrorType<unknown>;
/**
 * @summary Update user profile
 */
export declare const useUpdateProfile: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProfile>>, TError, {
        data: BodyType<UpdateProfileRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateProfile>>, TError, {
    data: BodyType<UpdateProfileRequest>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map