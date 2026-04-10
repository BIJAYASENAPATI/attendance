import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
    reducerPath: "products",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: [
        "Services", "Metadata", "ServiceDescriptions",
        "Staff", "ServiceZone", "ServiceZoneStaffs", "Day"
    ],
    endpoints: (builder) => ({

        // ── AUTH ──────────────────────────────────────────────────────────────
        loginUser: builder.mutation({
            query: (data) => ({ url: "/login", method: "POST", body: data }),
        }),

        // ── BUSINESS ──────────────────────────────────────────────────────────
        createBusiness: builder.mutation({
            query: (data) => ({ url: "/business", method: "POST", body: data }),
        }),
        getAllBusinesses: builder.query({
            query: () => ({ url: "/business", method: "GET" }),
            transformResponse: (response) => response.data,
        }),
        getBusinessById: builder.query({
            query: (id) => ({ url: `/business/${id}`, method: "GET" }),
        }),
        updateBusiness: builder.mutation({
            query: ({ id, data }) => ({ url: `/business/${id}`, method: "PUT", body: data }),
        }),
        deleteBusiness: builder.mutation({
            query: (id) => ({ url: `/business/${id}`, method: "DELETE" }),
        }),

        // ── SERVICE CATEGORY ─────────────────────────────────────────────────
        createServiceCategory: builder.mutation({
            query: (data) => ({
                url: "/services-category", method: "POST", body: data,
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }),
        }),
        getAllServiceCategories: builder.query({
            query: () => ({ url: "/services-category", method: "GET" }),
        }),
        getServiceCategoriesByBusiness: builder.query({
            query: (businessId) => ({ url: `/services-category?business_id=${businessId}`, method: "GET" }),
        }),
        getServiceCategoryById: builder.query({
            query: (id) => ({ url: `/services-category/${id}`, method: "GET" }),
        }),
        updateServiceCategory: builder.mutation({
            query: ({ id, data }) => ({ url: `/services-category/${id}`, method: "PUT", body: data }),
        }),
        deleteServiceCategory: builder.mutation({
            query: (id) => ({ url: `/services-category/${id}`, method: "DELETE" }),
        }),

        // ── SERVICES ─────────────────────────────────────────────────────────
        createService: builder.mutation({
            query: (data) => ({
                url: "/services", method: "POST", body: data,
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }),
        }),
        getAllServices: builder.query({
            query: () => ({ url: "/services", method: "GET" }),
            providesTags: ["Services"],
        }),
        getServiceById: builder.query({
            query: (id) => ({ url: `/services/${id}`, method: "GET" }),
        }),
        getServicesByBusiness: builder.query({
            query: () => "/services-business",
            transformResponse: (response) => response.data,
        }),
        updateService: builder.mutation({
            query: ({ id, data }) => ({ url: `/services/${id}`, method: "PUT", body: data }),
            invalidatesTags: ["Services"],
        }),
        deleteService: builder.mutation({
            query: (id) => ({ url: `/services/${id}`, method: "DELETE" }),
            invalidatesTags: ["Services"],
        }),

        // ── SERVICE PRICE ────────────────────────────────────────────────────
        createServicePrice: builder.mutation({
            query: (body) => ({ url: "/services-price", method: "POST", body }),
        }),
        updateServicePrice: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/service-price/${id}`, method: "PUT", body }),
        }),
        getSingleServicePrice: builder.query({
            query: (id) => ({ url: `/services-price/${id}`, method: "GET" }),
        }),
        getPricesByBusiness: builder.query({
            query: (businessId) => ({ url: "/services-price", method: "GET", params: { business_id: businessId } }),
        }),
        deleteServicePrice: builder.mutation({
            query: (id) => ({ url: `/services-price/${id}`, method: "DELETE" }),
        }),

        // ── DAYS ─────────────────────────────────────────────────────────────
        createDay: builder.mutation({
            query: (data) => ({
                url: "/days", method: "POST", body: data,
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }),
        }),
        getAllDays: builder.query({
            query: () => "/days",
            transformResponse: (response) => response.data,
            providesTags: ["Day"],
        }),

        // ── SERVICE METADATA ─────────────────────────────────────────────────
        createServiceMetadata: builder.mutation({
            query: (data) => ({ url: "/service-metadata", method: "POST", body: data }),
            invalidatesTags: ["Metadata"],
        }),
        getAllServiceMetadata: builder.query({
            query: () => "/service-metadata",
            transformResponse: (response) =>
                Array.isArray(response) ? response : response?.data ?? [],
            providesTags: ["Metadata"],
        }),
        getSingleServiceMetadata: builder.query({
            query: (id) => `/service-metadata/${id}`,
            providesTags: ["Metadata"],
        }),
        updateServiceMetadata: builder.mutation({
            query: ({ id, body }) => ({ url: `/service-metadata/${id}`, method: "PUT", body }),
            invalidatesTags: ["Metadata"],
        }),
        deleteServiceMetadata: builder.mutation({
            query: (id) => ({ url: `/service-metadata/${id}`, method: "DELETE" }),
            invalidatesTags: ["Metadata"],
        }),

        // ── SERVICE DESCRIPTION ──────────────────────────────────────────────
        createServiceDescription: builder.mutation({
            query: (data) => ({ url: "/service-descriptions", method: "POST", body: data }),
            invalidatesTags: ["ServiceDescriptions"],
        }),
        getDescriptionsByService: builder.query({
            query: (serviceId) => `/service-descriptions/service/${serviceId}`,
            providesTags: ["ServiceDescriptions"],
        }),
        getSingleServiceDescription: builder.query({
            query: (id) => `/service-descriptions/${id}`,
            providesTags: ["ServiceDescriptions"],
        }),
        updateServiceDescription: builder.mutation({
            query: ({ id, data }) => ({ url: `/service-descriptions/${id}`, method: "PUT", body: data }),
            invalidatesTags: ["ServiceDescriptions"],
        }),
        deleteServiceDescription: builder.mutation({
            query: (id) => ({ url: `/service-descriptions/${id}`, method: "DELETE" }),
            invalidatesTags: ["ServiceDescriptions"],
        }),

        // ── STAFF ─────────────────────────────────────────────────────────────
        createStaff: builder.mutation({
            query: (data) => ({ url: "/staffs", method: "POST", body: data }),
        }),
        getAllStaffs: builder.query({
            query: () => "/staffs",
            providesTags: ["Staff"],
        }),
        getSingleStaff: builder.query({
            query: (id) => `/staffs/${id}`,
        }),
        updateStaff: builder.mutation({
            query: ({ id, body }) => ({ url: `/staffs/${id}`, method: "PUT", body }),
            invalidatesTags: ["Staff"],
        }),
        deleteStaff: builder.mutation({
            query: (id) => ({ url: `/staffs/${id}`, method: "DELETE" }),
            invalidatesTags: ["Staff"],
        }),

        // ── SERVICE ZONES ─────────────────────────────────────────────────────
        createServiceZone: builder.mutation({
            query: (data) => ({ url: "/service-zones", method: "POST", body: data }),
            invalidatesTags: ["ServiceZone"],
        }),
        getAllServiceZones: builder.query({
            query: () => "/service-zones",
            providesTags: ["ServiceZone"],
        }),
        getServiceZoneById: builder.query({
            query: (id) => `/service-zones/${id}`,
        }),
        updateServiceZone: builder.mutation({
            query: ({ id, data }) => ({ url: `/service-zones/${id}`, method: "PUT", body: data }),
            invalidatesTags: ["ServiceZone"],
        }),
        deleteServiceZone: builder.mutation({
            query: (id) => ({ url: `/service-zones/${id}`, method: "DELETE" }),
            invalidatesTags: ["ServiceZone"],
        }),
        // Toggle Manual Inactive Status
        toggleServiceZoneManualInactive: builder.mutation({
            query: ({ id, is_manually_inactive, reason, until }) => ({
                url: `/service-zones/${id}/toggle-inactive`,
                method: "PATCH",
                body: {
                    is_manually_inactive,
                    ...(reason !== undefined && { reason }),
                    ...(until !== undefined && { until }),
                },
            }),
        }),

        updateServiceZoneInactivePeriods: builder.mutation({
            query: ({ id, inactive_periods }) => ({
                url: `/service-zones/${id}/inactive-periods`,
                method: "PATCH",
                body: { inactive_periods },
            }),
        }),

        // ── SERVICE ZONE STAFFS ───────────────────────────────────────────────
        assignStaffToZone: builder.mutation({
            query: (data) => ({
                url: "/service-zone-staffs",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["ServiceZoneStaffs"],
        }),
        getStaffByServiceZone: builder.query({
            query: (service_zone_id) => `/service-zone-staffs/zone/${service_zone_id}`,
            transformResponse: (response) =>
                Array.isArray(response) ? response : response?.data ?? [],
            providesTags: ["ServiceZoneStaffs"],
        }),
        removeStaffFromZone: builder.mutation({
            query: (id) => ({
                url: `/service-zone-staffs/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ServiceZoneStaffs"],
        }),

        // ── SERVICE ZONE WORKING DAYS ─────────────────────────────────────────
        createServiceZoneWorkingDays: builder.mutation({
            query: (data) => ({ url: "/service-zone-working-days", method: "POST", body: data }),
        }),



        // SLOT 
        createSlot: builder.mutation({
            query: (data) => ({ url: "/slots", method: "POST", body: data }),
            invalidatesTags: ["Slots"],
        }),
        getSlotsByServiceZone: builder.query({
            query: ({ service_zone_id, date }) =>
                `/slots/service-zone/${service_zone_id}?date=${date}`,
            transformResponse: (response) => {
                if (Array.isArray(response)) return response;
                if (response?.data) return response.data;
                return [];
            },
            providesTags: ["Slots"],
        }),
        deleteSlot: builder.mutation({
            query: (id) => ({ url: `/slots/${id}`, method: "DELETE" }),
            invalidatesTags: ["Slots"],
        }),
        autoGenerateSlots: builder.mutation({
            query: (data) => ({ url: "/slots/auto-generate", method: "POST", body: data }),
            invalidatesTags: ["Slots"],
        }),
        updateSlot: builder.mutation({
            query: ({ id, start_time, duration_minutes }) => ({
                url: `/slots/${id}`,
                method: "PUT",
                body: { start_time, duration_minutes },
            }),
            invalidatesTags: ["Slots"],
        }),
        bulkDeleteSlots: builder.mutation({
            query: (slot_ids) => ({
                url: "/slots/bulk",
                method: "DELETE",
                body: { slot_ids },
            }),
            invalidatesTags: ["Slots"],
        }),


        // CUSTOMERS
        getCustomersByBusiness: builder.query({
            query: () => ({
                url: "/customers",
                method: "GET",
            }),
            transformResponse: (response) =>
                Array.isArray(response) ? response : response?.data ?? [],
            providesTags: ["Customers"],
        }),
        getCustomerById: builder.query({
            query: (id) => ({ url: `/customers/${id}`, method: "GET" }),
            transformResponse: (response) => response?.data ?? response,
            providesTags: (result, error, id) => [{ type: "Customers", id }],
        }),
        createCustomer: builder.mutation({
            query: (data) => ({ url: "/customers", method: "POST", body: data }),
            invalidatesTags: ["Customers"],
        }),
        updateCustomer: builder.mutation({
            query: ({ id, data }) => ({ url: `/customers/${id}`, method: "PUT", body: data }),
            invalidatesTags: ["Customers"],
        }),
        deleteCustomer: builder.mutation({
            query: (id) => ({ url: `/customers/${id}`, method: "DELETE" }),
            invalidatesTags: ["Customers"],
        }),


        // ── BOOKING STATUS 
        createBookingStatus: builder.mutation({
            query: (data) => ({ url: "/booking-status", method: "POST", body: data }),
            invalidatesTags: ["BookingStatus"],
        }),
        getAllBookingStatuses: builder.query({
            query: () => ({ url: "/booking-status", method: "GET" }),
            transformResponse: (response) =>
                Array.isArray(response) ? response : response?.data ?? [],
            providesTags: ["BookingStatus"],
        }),


        // ── BOOKINGS 
        createBooking: builder.mutation({
            query: (data) => ({ url: "/bookings", method: "POST", body: data }),
            invalidatesTags: ["Bookings"],
        }),
        getAllBookings: builder.query({
            query: () => ({ url: "/bookings", method: "GET" }),
            transformResponse: (response) =>
                Array.isArray(response) ? response : response?.data ?? [],
            providesTags: ["Bookings"],
        }),
        getBookingById: builder.query({
            query: (id) => ({ url: `/bookings/${id}`, method: "GET" }),
            transformResponse: (response) => response?.data ?? response,
            providesTags: (result, error, id) => [{ type: "Bookings", id }],
        }),
        updateBookingStatus: builder.mutation({
            query: ({ id, booking_status_id }) => ({
                url: `/bookings/${id}/status`,
                method: "PUT",
                body: { booking_status_id },
            }),
            invalidatesTags: ["Bookings"],
        }),
        deleteBooking: builder.mutation({
            query: (id) => ({ url: `/bookings/${id}`, method: "DELETE" }),
            invalidatesTags: ["Bookings"],
        }),

        //Booking status
        updateBookingStatusEntity: builder.mutation({
            query: ({ id, status }) => ({
                url: `/booking-status/${id}`,
                method: "PUT",
                body: { status },
            }),
            invalidatesTags: ["BookingStatus"],
        }),
        deleteBookingStatusEntity: builder.mutation({
            query: (id) => ({
                url: `/booking-status/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["BookingStatus"],
        }),
        updateSlot: builder.mutation({
            query: ({ id, start_time, end_time }) => ({
                url: `/slots/${id}`,
                method: "PUT",
                body: { start_time, end_time },
            }),
            invalidatesTags: ["Slots"],
        }),


    }),
});

export const {
    useLoginUserMutation,

    useCreateBusinessMutation,
    useGetAllBusinessesQuery,
    useGetBusinessByIdQuery,
    useUpdateBusinessMutation,
    useDeleteBusinessMutation,

    useCreateServiceCategoryMutation,
    useGetAllServiceCategoriesQuery,
    useGetServiceCategoriesByBusinessQuery,
    useGetServiceCategoryByIdQuery,
    useUpdateServiceCategoryMutation,
    useDeleteServiceCategoryMutation,

    useCreateServiceMutation,
    useGetAllServicesQuery,
    useGetServiceByIdQuery,
    useGetServicesByBusinessQuery,
    useUpdateServiceMutation,
    useDeleteServiceMutation,

    useCreateDayMutation,
    useGetAllDaysQuery,

    useCreateServicePriceMutation,
    useUpdateServicePriceMutation,
    useGetSingleServicePriceQuery,
    useGetPricesByBusinessQuery,
    useDeleteServicePriceMutation,

    useCreateServiceMetadataMutation,
    useGetAllServiceMetadataQuery,
    useGetSingleServiceMetadataQuery,
    useUpdateServiceMetadataMutation,
    useDeleteServiceMetadataMutation,

    useCreateServiceDescriptionMutation,
    useGetDescriptionsByServiceQuery,
    useGetSingleServiceDescriptionQuery,
    useUpdateServiceDescriptionMutation,
    useDeleteServiceDescriptionMutation,

    useCreateStaffMutation,
    useGetAllStaffsQuery,
    useGetSingleStaffQuery,
    useUpdateStaffMutation,
    useDeleteStaffMutation,

    useCreateServiceZoneMutation,
    useGetAllServiceZonesQuery,
    useGetServiceZoneByIdQuery,
    useUpdateServiceZoneMutation,
    useDeleteServiceZoneMutation,
    useToggleServiceZoneManualInactiveMutation,
    useUpdateServiceZoneInactivePeriodsMutation,

    useAssignStaffToZoneMutation,
    useGetStaffByServiceZoneQuery,
    useRemoveStaffFromZoneMutation,

    useCreateSlotMutation,
    useGetSlotsByServiceZoneQuery,
    useDeleteSlotMutation,
    useAutoGenerateSlotsMutation,
    useUpdateSlotMutation,
    useBulkDeleteSlotsMutation,


    useGetCustomersByBusinessQuery,
    useGetCustomerByIdQuery,
    useCreateCustomerMutation,
    useUpdateCustomerMutation,
    useDeleteCustomerMutation,

    useCreateBookingStatusMutation,
    useGetAllBookingStatusesQuery,

    useCreateBookingMutation,
    useGetAllBookingsQuery,
    useGetBookingByIdQuery,
    useUpdateBookingStatusMutation,
    useDeleteBookingMutation,

    useUpdateBookingStatusEntityMutation,
    useDeleteBookingStatusEntityMutation,


    useCreateServiceZoneWorkingDaysMutation,
} = productsApi;