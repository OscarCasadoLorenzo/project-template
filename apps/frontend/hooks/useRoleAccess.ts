import { useAuth, UserRole } from "@/contexts/AuthContext";

export function useRoleAccess() {
  const { user, hasRole } = useAuth();

  const canAccess = (allowedRoles: UserRole[]): boolean => {
    return hasRole(allowedRoles);
  };

  const isAdmin = (): boolean => {
    return hasRole(["ADMIN"]);
  };

  const isMaster = (): boolean => {
    return hasRole(["MASTER"]);
  };

  const isPlayer = (): boolean => {
    return hasRole(["PLAYER"]);
  };

  return {
    user,
    canAccess,
    isAdmin,
    isMaster,
    isPlayer,
  };
}
