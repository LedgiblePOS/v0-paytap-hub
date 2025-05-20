import { Permission, UserRole } from '@/types/enums';
import permissionService from '../permissionService';

describe('permissionService', () => {
  describe('hasPermission', () => {
    it('should return true for permissions assigned to SUPER_ADMIN', () => {
      expect(permissionService.hasPermission(UserRole.SUPER_ADMIN, 'MANAGE_USERS')).toBe(true);
    });

    it('should return false for permissions not assigned to a role', () => {
      expect(permissionService.hasPermission(UserRole.USER, 'MANAGE_USERS')).toBe(false);
    });

    it('should handle invalid input', () => {
      // @ts-ignore - Testing invalid input
      expect(permissionService.hasPermission(null, 'VIEW_DASHBOARD')).toBe(false);
      // @ts-ignore - Testing invalid input
      expect(permissionService.hasPermission(UserRole.ADMIN, null)).toBe(false);
    });
  });

  describe('getRolePermissions', () => {
    it('should return all permissions for a role', () => {
      const adminPerms = permissionService.getRolePermissions(UserRole.ADMIN);
      expect(adminPerms).toContain('VIEW_DASHBOARD');
      expect(adminPerms).toContain('VIEW_INVENTORY');
    });

    it('should return empty array for invalid role', () => {
      // @ts-ignore - Testing invalid input
      expect(permissionService.getRolePermissions(null)).toEqual([]);
    });

    it('should handle user with no special permissions', () => {
      const userPerms = permissionService.getRolePermissions(UserRole.USER);
      expect(userPerms).not.toContain('VIEW_SETTINGS');
    });

    it('should properly check permissions for different roles', () => {
      expect(permissionService.hasPermission(UserRole.ADMIN, 'VIEW_INVENTORY')).toBe(true);
      expect(permissionService.hasPermission(UserRole.USER, 'VIEW_INVENTORY')).toBe(false);
    });
  });
});
