import { apiSlice } from "./apiSlice";
const USERS_URL = '/api/users'

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/login`,
                method: 'POST',
                body: data
            })
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/register`,
                method: 'POST',
                body: data
            })
        }),
        otpVerify: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/otpVerify`,
                method: 'POST',
                body: data
            })
        }),
        resendOtp: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/resendOtp`,
                method: 'POST',
                body: data
            })
        }),
        forgotPassword: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/forgotPassword`,
                method: 'POST',
                body: data
            })
        }),
        resetPassword: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/resetPassword`,
                method: 'POST',
                body: data
            })
        }),
        googleRegister: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/googleRegister`,
                method: 'POST',
                body: data
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST'
            })
        }),
        getUserProfile: builder.mutation({
            query: (userId) => ({
                url: `${USERS_URL}/profile/${userId}`,
                method: 'GET'
            })
        }),
        getUserPosts: builder.mutation({
            query: (userId) => ({
                url: `${USERS_URL}/userPosts/${userId}`,
                method: 'GET'
            })
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: data
            })
        }),
        getCategories: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/getCategories`,
                method: 'GET'
            })
        }),
        addProduct: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/addProduct`,
                method: 'POST',
                body: data
            })
        }),
        showPosts: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/showPosts`,
                method: 'GET'
            })
        }),
        getPostById: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/postDetails/${data}`,
                method: 'GET'
            })
        }),
        followedUsers: builder.mutation({          
            query: () => ({
                url: `${USERS_URL}/followedUsers`,
                method: 'GET'
            })

        }),
        followArtist: builder.mutation({          
            query: (data) => ({
                url: `${USERS_URL}/followArtist/${data}`,
                method: 'PUT',
                body: data
            })

        }),
        unFollowArtist: builder.mutation({          
            query: (data) => ({
                url: `${USERS_URL}/unFollowArtist/${data}`,
                method: 'PUT',
                body: data
            })

        }),
        getArtists: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/getArtists`,
                method: 'GET'
            })
        }),
        accessChat: builder.mutation({
            query: (userId) => ({
                url: `${USERS_URL}/accessChat`,
                method: 'POST',
                body: {userId}
            })
        }),
        fetchChat: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/fetchChats`,
                method: 'GET'
            })
        }), 
        sendMessage: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/sendMessage`,
                method: 'POST',
                body: data
            })
        }),
        fetchMessages: builder.mutation({
            query: (chatId) => ({
                url: `${USERS_URL}/allMessages/${chatId}`,
                method: 'GET'
            })
        }),
        checkBlock: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/checkBlock`,
                method: 'PUT',
                body: data
            })
        }),
    })
})

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useOtpVerifyMutation,
    useResendOtpMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useGoogleRegisterMutation,
    useGetUserProfileMutation,
    useGetUserPostsMutation,
    useUpdateUserMutation,
    useGetCategoriesMutation,
    useAddProductMutation,
    useShowPostsMutation,
    useGetPostByIdMutation,
    useFollowedUsersMutation,
    useFollowArtistMutation,
    useUnFollowArtistMutation,
    useGetArtistsMutation,
    useAccessChatMutation,
    useFetchChatMutation,
    useSendMessageMutation,
    useFetchMessagesMutation,
    useCheckBlockMutation
} = userApiSlice
