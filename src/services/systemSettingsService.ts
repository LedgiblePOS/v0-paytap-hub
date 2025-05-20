
/**
 * @deprecated This file is kept for backward compatibility.
 * Import from '@/services/settings' instead.
 */

import { systemSettingsService, securitySettingsService } from './settings';
import type { SystemSettings, SecuritySettings } from './settings';

// Re-export for backward compatibility
export { SystemSettings, SecuritySettings };
export default {
  ...systemSettingsService,
  ...securitySettingsService,
};
