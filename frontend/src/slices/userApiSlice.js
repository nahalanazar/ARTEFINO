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
                method: 'POST',
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
        showLandingPosts: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/showLandingPosts`,
                method: 'GET'
            })
        }),
        getPostById: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/postDetails/${data}`,
                method: 'GET'
            })
        }),
        removePost: builder.mutation({          
            query: (data) => ({
                url: `${USERS_URL}/removePost/${data}`,
                method: 'DELETE',
                body: data
            })
        }),
        updatePost: builder.mutation({
            query: ({ postId, postData }) => ({
                url: `${USERS_URL}/updatePost/${postId}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set the content type to JSON
                },
                body: JSON.stringify(postData), // Convert postData to a JSON string
            }),
        }),
        reportPost: builder.mutation({
            query: ({ postId, data }) => ({
                url: `${USERS_URL}/reportPost`,
                method: 'POST',
                body: {
                    postId: postId,
                    data: data
                }
            })
        }),
        likePost: builder.mutation({          
            query: (postId) => ({
                url: `${USERS_URL}/likePost/${postId}`,
                method: 'POST'
            })
        }),
        unlikePost: builder.mutation({          
            query: (postId) => ({
                url: `${USERS_URL}/unlikePost/${postId}`,
                method: 'DELETE'
            })
        }),
        commentPost: builder.mutation({          
            query: ({ postId, text }) => ({
                url: `${USERS_URL}/commentPost/${postId}`,
                method: 'POST',
                body: JSON.stringify({ text }), // Stringify the body
                headers: {
                'Content-Type': 'application/json', // Set the content type
                },
            }),
        }),
        commentDelete: builder.mutation({          
            query: ({ postId, commentId }) => ({
                url: `${USERS_URL}/commentDelete/${postId}`,
                method: 'DELETE',
                body: { commentId }, // Send commentId directly in the body
                
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
        removeArtist: builder.mutation({          
            query: (data) => ({
                url: `${USERS_URL}/removeArtist/${data}`,
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
        fetchNotifications: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/allNotifications`,
                method: 'GET'
            })
        }),
        deleteNotification: builder.mutation({
            query: (notificationId) => ({
                url: `${USERS_URL}/deleteNotification/${notificationId}`,
                method: 'PUT'
            })
        }),
        fetchUserNotifications: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/userNotifications`,
                method: 'GET'
            })
        }),
        acceptRequest: builder.mutation({          
            query: (data) => ({
                url: `${USERS_URL}/acceptRequest/${data}`,
                method: 'PUT',
                body: data
            })

        }),
        rejectRequest: builder.mutation({          
            query: (data) => ({
                url: `${USERS_URL}/rejectRequest/${data}`,
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
    useRemovePostMutation,
    useUpdatePostMutation,
    useReportPostMutation,
    useLikePostMutation,
    useUnlikePostMutation,
    useCommentPostMutation,
    useCommentDeleteMutation,
    useFollowedUsersMutation,
    useFollowArtistMutation,
    useUnFollowArtistMutation,
    useRemoveArtistMutation,
    useGetArtistsMutation,
    useAccessChatMutation,
    useFetchChatMutation,
    useSendMessageMutation,
    useFetchMessagesMutation,
    useCheckBlockMutation,
    useFetchNotificationsMutation,
    useDeleteNotificationMutation,
    useFetchUserNotificationsMutation,
    useAcceptRequestMutation,
    useRejectRequestMutation,
    useShowLandingPostsMutation
} = userApiSlice
