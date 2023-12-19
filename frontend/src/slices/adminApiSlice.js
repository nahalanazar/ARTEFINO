import { apiSlice } from "./apiSlice";
import { 
    ADMIN_AUTHENTICATION_URL,
    ADMIN_LOGOUT_URL,
    ADMIN_REGISTRATION_URL,
    ADMIN_PROFILE_URL,
    ADMIN_USERS_DATA_FETCH_URL,
    ADMIN_BLOCK_USER_URL,
    ADMIN_UNBLOCK_USER_URL,
    ADMIN_CATEGORIES_DATA_FETCH_URL,
    ADMIN_ADD_CATEGORY_URL,
    ADMIN_UPDATE_CATEGORY_URL,
    ADMIN_UNLIST_CATEGORY_URL,
    ADMIN_RELIST_CATEGORY_URL,
    ADMIN_REPORTED_POSTS_URL,
    ADMIN_REMOVE_REPORTED_POSTS_URL
} from '../utils/constants.js';


export const adminApiSlice = apiSlice.injectEndpoints({
    
    endpoints: (builder) => ({
        
        adminLogin: builder.mutation({
            
            query: (data) => ({
                url: ADMIN_AUTHENTICATION_URL,
                method: 'POST',
                body: data
            })

        }),
        adminLogout: builder.mutation({
            
            query: () => ({
                url: ADMIN_LOGOUT_URL,
                method: 'POST'
            })

        }),
        adminRegister: builder.mutation({
            
            query: (data) => ({
                url: ADMIN_REGISTRATION_URL,
                method: 'POST',
                body: data
            })

        }),
        updateAdmin: builder.mutation({
            
            query: (data) => ({
                url: ADMIN_PROFILE_URL,
                method: 'PUT',
                body: data
            })

        }),
        getUsersData: builder.mutation({
            
            query: () => ({
                url: ADMIN_USERS_DATA_FETCH_URL,
                method: 'POST'
            })

        }),
        blockUserByAdmin: builder.mutation({
            
            query: (data) => ({
                url: ADMIN_BLOCK_USER_URL,
                method: 'PUT',
                body: data
            })

        }),
        unblockUserByAdmin: builder.mutation({
            
            query: (data) => ({
                url: ADMIN_UNBLOCK_USER_URL,
                method: 'PUT',
                body: data
            })

        }),
        getCategoriesData: builder.mutation({
            
            query: () => ({
                url: ADMIN_CATEGORIES_DATA_FETCH_URL,
                method: 'POST'
            })

        }),
        addCategory: builder.mutation({
            
            query: (data) => ({
                url: ADMIN_ADD_CATEGORY_URL,
                method: 'POST',
                body: data
            })

        }),
        updateCategoryByAdmin: builder.mutation({
            
            query: (data) => ({
                url: ADMIN_UPDATE_CATEGORY_URL,
                method: 'PUT',
                body: data
            })

        }),
        unListCategoryByAdmin: builder.mutation({
            
            query: (data) => ({
                url: ADMIN_UNLIST_CATEGORY_URL,
                method: 'PUT',
                body: data
            })

        }),
        reListCategoryByAdmin: builder.mutation({
            
            query: (data) => ({
                url: ADMIN_RELIST_CATEGORY_URL,
                method: 'PUT',
                body: data
            })

        }),
        getReportedPosts: builder.mutation({
            
            query: () => ({
                url: ADMIN_REPORTED_POSTS_URL,
                method: 'GET'
            })

        }),
        removeReportedPost: builder.mutation({
            
            query: (data) => ({
                url: ADMIN_REMOVE_REPORTED_POSTS_URL,
                method: 'PUT',
                body: data
            })

        }),
    })

})


export const {
    useAdminLoginMutation,
    useAdminLogoutMutation,
    useAdminRegisterMutation,
    useUpdateAdminMutation,
    useGetUsersDataMutation,
    useBlockUserByAdminMutation,
    useUnblockUserByAdminMutation,
    useGetCategoriesDataMutation,
    useAddCategoryMutation,
    useUpdateCategoryByAdminMutation,
    useUnListCategoryByAdminMutation,
    useReListCategoryByAdminMutation,
    useGetReportedPostsMutation,
    useRemoveReportedPostMutation
} = adminApiSlice;