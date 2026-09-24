import { useAuthStore } from '../stores/auth-store';

export function usePermission() {
  const permissions = useAuthStore((state) => state.permissions);
  const user = useAuthStore((state) => state.user);

  const hasPermission = (permission: string) => {
    if (user?.role === 'super_admin') return true;
    return permissions.includes(permission);
  };

  const canAccess = (permission: string) => hasPermission(permission);

  return { hasPermission, canAccess };
}
