import { useMutation, useQuery, UseQueryOptions, useQueryClient } from "@tanstack/react-query";
import { getSession, OutputType as SessionOutput } from "../endpoints/auth/session_GET.schema";
import { loginUser, InputType as LoginInput, OutputType as LoginOutput } from "../endpoints/auth/login_POST.schema";
import { registerUser, InputType as RegisterInput, OutputType as RegisterOutput } from "../endpoints/auth/register_POST.schema";
import { logoutUser } from "../endpoints/auth/logout_POST.schema";

export const SESSION_QUERY_KEY = ["auth", "session"];

export function useSession(options?: Omit<UseQueryOptions<SessionOutput>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: () => getSession(),
    ...options,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation<LoginOutput, Error, LoginInput>({
    mutationFn: (input) => loginUser(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY }),
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation<RegisterOutput, Error, RegisterInput>({
    mutationFn: (input) => registerUser(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY }),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY }),
  });
}
