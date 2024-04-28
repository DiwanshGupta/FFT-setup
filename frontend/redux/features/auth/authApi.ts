import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userLoggedOut, userRegistration } from "./authSlice";

type RegistrationResponse = {
    message: string;
    activationToken: string;
    activeCodeToken: string;
};
type RegistrationData = {};

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // EndPoints
        register: builder.mutation<RegistrationResponse, RegistrationData>({
            query: (data) => ({
                url: "register",
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
            async onQueryStarted (arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userRegistration({
                            token: result.data.activeCodeToken,
                        })
                    );
                } catch (error: any) {
                    console.log(error);
                }
            },
        }),
        activation: builder.mutation({
            query: ({ activation_token, activation_code }) => ({
                url: "activeuser",
                method: "POST",
                body: {
                    activation_token,
                    activation_code,
                },
            }),
        }),
        login: builder.mutation({
            query: ({ email, password }) => ({
                url: "login",
                method: "POST",
                body: { email, password },
                credentials: "include" as const,
            }),
            async onQueryStarted (arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userLoggedIn({
                            accessToken: result.data.activeCodeToken,
                            user: result.data.user,
                        })
                    );
                } catch (error: any) {
                    console.log(error);
                }
            },
        }),
        socialAuth: builder.mutation({
            query: ({ email, name, avatar }) => ({
                url: "social",
                method: "POST",
                body: { email, name, avatar },
                credentials: "include" as const,
            }),
            async onQueryStarted (arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userLoggedIn({
                            accessToken: result.data.activeCodeToken,
                            user: result.data.user,
                        })
                    );
                } catch (error: any) {
                    console.log(error);
                }
            },
        }),
        logOut: builder.query({
            query: () => ({
                url: "logout",
                method: "GET",
                credentials: "include" as const,
            }),
            async onQueryStarted (arg, { queryFulfilled, dispatch }) {
                try {
                    dispatch(
                        userLoggedOut()
                    );
                } catch (error: any) {
                    console.log(error);
                }
            },
        }),
    }),
});

export const {
    useRegisterMutation,
    useActivationMutation,
    useLoginMutation,
    useSocialAuthMutation,
    useLogOutQuery
} = authApi;
