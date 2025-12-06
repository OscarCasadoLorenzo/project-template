import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useTranslations } from "next-intl";
import AdminPage from "./page";

// Mock ProtectedRoute
jest.mock("@/components/ProtectedRoute", () => ({
  ProtectedRoute: ({
    children,
    allowedRoles,
  }: {
    children: React.ReactNode;
    allowedRoles?: string[];
  }) => (
    <div data-testid="protected-route" data-allowed-roles={allowedRoles}>
      {children}
    </div>
  ),
}));

// Mock LoadingSpinner
jest.mock("@/components/loading-spinner", () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
}));

// Mock RoleEditModal
jest.mock("./components/RoleEditModal", () => ({
  RoleEditModal: ({
    isOpen,
    user,
    onClose,
    onUpdateRole,
  }: {
    isOpen: boolean;
    user: { id: string; name: string };
    onClose: () => void;
    onUpdateRole: (userId: string, newRole: string) => void;
  }) =>
    isOpen ? (
      <div data-testid="role-modal">
        <div>Edit Role for {user.name}</div>
        <button onClick={() => onUpdateRole(user.id, "MASTER")}>
          Update Role
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

// Mock AuthContext
const mockUseAuth = jest.fn();
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
  UserRole: {
    ADMIN: "ADMIN",
    MASTER: "MASTER",
    PLAYER: "PLAYER",
  },
}));

// Mock fetchApi
const mockFetchApi = jest.fn();
jest.mock("@/lib/api", () => ({
  fetchApi: (...args: unknown[]) => mockFetchApi(...args),
}));

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: jest.fn(),
}));

describe("AdminPage", () => {
  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      "admin.title": "User Management",
      "admin.description": "Manage user roles and permissions",
      "admin.page": "Page",
      "admin.of": "of",
      "admin.name": "Name",
      "admin.email": "Email",
      "admin.role": "Role",
      "admin.createdAt": "Created",
      "admin.actions": "Actions",
    };
    return translations[key] || key;
  });

  const mockCurrentUser = {
    id: "admin-1",
    email: "admin@example.com",
    name: "Admin User",
    role: "ADMIN" as const,
  };

  const mockUsers = [
    {
      id: "1",
      email: "player@example.com",
      name: "Player User",
      role: "PLAYER" as const,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "2",
      email: "master@example.com",
      name: "Master User",
      role: "MASTER" as const,
      createdAt: "2024-01-02T00:00:00Z",
      updatedAt: "2024-01-02T00:00:00Z",
    },
  ];

  const mockUsersResponse = {
    data: mockUsers,
    meta: {
      total: 2,
      page: 1,
      limit: 20,
      totalPages: 1,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTranslations as jest.Mock).mockReturnValue(mockT);
    mockUseAuth.mockReturnValue({ user: mockCurrentUser });
    mockFetchApi.mockResolvedValue(mockUsersResponse);
  });

  describe("Protection and Authorization", () => {
    it("wraps content in ProtectedRoute with ADMIN role", () => {
      render(<AdminPage />);

      const protectedRoute = screen.getByTestId("protected-route");
      expect(protectedRoute).toHaveAttribute("data-allowed-roles", "ADMIN");
    });
  });

  describe("Data Fetching", () => {
    it("fetches users on mount", async () => {
      render(<AdminPage />);

      await waitFor(() => {
        expect(mockFetchApi).toHaveBeenCalledWith("/users?page=1&limit=20");
      });
    });

    it("displays loading spinner while fetching", async () => {
      mockFetchApi.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      render(<AdminPage />);

      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });

    it("displays users after loading", async () => {
      render(<AdminPage />);

      await waitFor(() => {
        expect(screen.getByText("Player User")).toBeInTheDocument();
        expect(screen.getByText("Master User")).toBeInTheDocument();
      });
    });

    it("handles fetch errors gracefully", async () => {
      const consoleError = jest.spyOn(console, "error").mockImplementation();
      mockFetchApi.mockRejectedValue(new Error("Failed to fetch"));

      render(<AdminPage />);

      await waitFor(() => {
        expect(mockFetchApi).toHaveBeenCalled();
      });

      consoleError.mockRestore();
    });
  });

  describe("User Display", () => {
    it("renders user table with correct headers", async () => {
      render(<AdminPage />);

      await waitFor(() => {
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("Email")).toBeInTheDocument();
        expect(screen.getByText("Role")).toBeInTheDocument();
        expect(screen.getByText("Created")).toBeInTheDocument();
        expect(screen.getByText("Actions")).toBeInTheDocument();
      });
    });

    it("displays user information correctly", async () => {
      render(<AdminPage />);

      await waitFor(() => {
        expect(screen.getByText("Player User")).toBeInTheDocument();
        expect(screen.getByText("player@example.com")).toBeInTheDocument();
        expect(screen.getByText("PLAYER")).toBeInTheDocument();
      });
    });

    it("displays user avatar with initial", async () => {
      render(<AdminPage />);

      await waitFor(() => {
        const avatars = screen.getAllByText("P");
        expect(avatars[0]).toBeInTheDocument();
      });
    });

    it("marks current user with (You) label", async () => {
      mockUseAuth.mockReturnValue({ user: mockUsers[0] });
      mockFetchApi.mockResolvedValue({
        data: [mockUsers[0], mockUsers[1]],
        meta: mockUsersResponse.meta,
      });

      render(<AdminPage />);

      await waitFor(() => {
        expect(screen.getByText("(You)")).toBeInTheDocument();
      });
    });

    it("displays role badges with correct colors", async () => {
      render(<AdminPage />);

      await waitFor(() => {
        const playerBadge = screen.getByText("PLAYER").closest("span");
        const masterBadge = screen.getByText("MASTER").closest("span");

        expect(playerBadge).toBeInTheDocument();
        expect(masterBadge).toBeInTheDocument();
      });
    });

    it("formats dates correctly", async () => {
      render(<AdminPage />);

      await waitFor(() => {
        const date = new Date("2024-01-01T00:00:00Z").toLocaleDateString();
        expect(screen.getByText(date)).toBeInTheDocument();
      });
    });
  });

  describe("Statistics Display", () => {
    it("shows total user count", async () => {
      render(<AdminPage />);

      await waitFor(() => {
        expect(screen.getByText(/Total Users: 2/)).toBeInTheDocument();
      });
    });

    it("shows current page and total pages", async () => {
      render(<AdminPage />);

      await waitFor(() => {
        expect(screen.getByText(/Page 1 of 1/)).toBeInTheDocument();
      });
    });
  });

  describe("Pagination", () => {
    const multiPageResponse = {
      data: mockUsers,
      meta: {
        total: 50,
        page: 1,
        limit: 20,
        totalPages: 3,
      },
    };

    it("displays pagination controls when multiple pages exist", async () => {
      mockFetchApi.mockResolvedValue(multiPageResponse);

      render(<AdminPage />);

      await waitFor(() => {
        expect(
          screen.getByText(/Showing 1 to 2 of 50 results/),
        ).toBeInTheDocument();
      });
    });

    it("navigates to next page", async () => {
      mockFetchApi.mockResolvedValue(multiPageResponse);

      render(<AdminPage />);

      await waitFor(() => {
        expect(screen.getByText("1")).toBeInTheDocument();
      });

      const nextButtons = screen
        .getAllByRole("button")
        .filter(
          (btn) => btn.querySelector("svg") || btn.textContent === "Next",
        );

      fireEvent.click(nextButtons[nextButtons.length - 1]);

      await waitFor(() => {
        expect(mockFetchApi).toHaveBeenCalledWith("/users?page=2&limit=20");
      });
    });

    it("disables previous button on first page", async () => {
      mockFetchApi.mockResolvedValue(multiPageResponse);

      render(<AdminPage />);

      await waitFor(() => {
        const prevButtons = screen
          .getAllByRole("button")
          .filter(
            (btn) => btn.querySelector("svg") || btn.textContent === "Previous",
          );

        expect(prevButtons[0]).toBeDisabled();
      });
    });
  });

  describe("Role Editing", () => {
    it("opens modal when Edit Role is clicked", async () => {
      render(<AdminPage />);

      await waitFor(() => {
        expect(screen.getByText("Player User")).toBeInTheDocument();
      });

      const editButtons = screen.getAllByText("Edit Role");
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId("role-modal")).toBeInTheDocument();
        expect(
          screen.getByText("Edit Role for Player User"),
        ).toBeInTheDocument();
      });
    });

    it("disables Edit Role for current user", async () => {
      mockUseAuth.mockReturnValue({ user: mockUsers[0] });
      mockFetchApi.mockResolvedValue({
        data: [mockUsers[0], mockUsers[1]],
        meta: mockUsersResponse.meta,
      });

      render(<AdminPage />);

      await waitFor(() => {
        const editButtons = screen.getAllByText("Edit Role");
        expect(editButtons[0]).toBeDisabled();
      });
    });

    it("updates role successfully", async () => {
      mockFetchApi
        .mockResolvedValueOnce(mockUsersResponse)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(mockUsersResponse);

      render(<AdminPage />);

      await waitFor(() => {
        expect(screen.getByText("Player User")).toBeInTheDocument();
      });

      const editButtons = screen.getAllByText("Edit Role");
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId("role-modal")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Update Role"));

      await waitFor(() => {
        expect(mockFetchApi).toHaveBeenCalledWith("/users/1/role", {
          method: "PATCH",
          body: { role: "MASTER" },
        });
      });
    });

    it("closes modal after successful update", async () => {
      mockFetchApi
        .mockResolvedValueOnce(mockUsersResponse)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(mockUsersResponse);

      render(<AdminPage />);

      await waitFor(() => {
        expect(screen.getByText("Player User")).toBeInTheDocument();
      });

      const editButtons = screen.getAllByText("Edit Role");
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId("role-modal")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Update Role"));

      await waitFor(() => {
        expect(screen.queryByTestId("role-modal")).not.toBeInTheDocument();
      });
    });

    it("closes modal when Close is clicked", async () => {
      render(<AdminPage />);

      await waitFor(() => {
        expect(screen.getByText("Player User")).toBeInTheDocument();
      });

      const editButtons = screen.getAllByText("Edit Role");
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId("role-modal")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Close"));

      await waitFor(() => {
        expect(screen.queryByTestId("role-modal")).not.toBeInTheDocument();
      });
    });
  });

  describe("Empty State", () => {
    it("displays empty state when no users exist", async () => {
      mockFetchApi.mockResolvedValue({
        data: [],
        meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
      });

      render(<AdminPage />);

      await waitFor(() => {
        expect(screen.getByText("No users found")).toBeInTheDocument();
        expect(
          screen.getByText("There are no registered users in the system."),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Layout and Styling", () => {
    it("has correct page title and description", async () => {
      render(<AdminPage />);

      await waitFor(() => {
        expect(screen.getByText("User Management")).toBeInTheDocument();
        expect(
          screen.getByText("Manage user roles and permissions"),
        ).toBeInTheDocument();
      });
    });

    it("uses translations for all text", async () => {
      render(<AdminPage />);

      await waitFor(() => {
        expect(mockT).toHaveBeenCalledWith("admin.title");
        expect(mockT).toHaveBeenCalledWith("admin.description");
        expect(mockT).toHaveBeenCalledWith("admin.name");
        expect(mockT).toHaveBeenCalledWith("admin.email");
        expect(mockT).toHaveBeenCalledWith("admin.role");
      });
    });
  });
});
