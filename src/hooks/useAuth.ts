import { useQuery } from "@tanstack/react-query";
import type { User } from "@/types/schema";

export function useAuth() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: false, // Disable automatic query execution
    queryFn: () => {
      // Mock user data for development
      return Promise.resolve({
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        profileImageUrl: "",
        role: "user" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    },
  });

  // For demo purposes, return a mock authenticated user
  const mockUser: User = {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    profileImageUrl: "",
    role: "user" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return {
    user: mockUser,
    isLoading: false,
    isAuthenticated: true,
  };
}
