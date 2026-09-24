export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: 'dashboard.view',

  // Users
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',

  // Sites
  SITES_VIEW: 'sites.view',
  SITES_CREATE: 'sites.create',
  SITES_UPDATE: 'sites.update',
  SITES_DELETE: 'sites.delete',

  // Temperature
  TEMPERATURE_VIEW: 'temperature.view',
  TEMPERATURE_CREATE: 'temperature.create',
  TEMPERATURE_UPDATE: 'temperature.update',

  // Checklists
  CHECKLISTS_VIEW: 'checklists.view',
  CHECKLISTS_CREATE: 'checklists.create',
  CHECKLISTS_UPDATE: 'checklists.update',
  CHECKLISTS_APPROVE: 'checklists.approve',

  // Traceability
  TRACEABILITY_VIEW: 'traceability.view',
  TRACEABILITY_CREATE: 'traceability.create',
  TRACEABILITY_UPDATE: 'traceability.update',

  // Corrective Actions
  CORRECTIVE_VIEW: 'corrective.view',
  CORRECTIVE_CREATE: 'corrective.create',
  CORRECTIVE_APPROVE: 'corrective.approve',

  // Reports
  REPORTS_VIEW: 'reports.view',
  REPORTS_EXPORT: 'reports.export',

  // NFC
  NFC_SCAN: 'nfc.scan',
  NFC_MANAGE: 'nfc.manage',

  // HACCP
  HACCP_VIEW: 'haccp.view',
  HACCP_CREATE: 'haccp.create',
  HACCP_UPDATE: 'haccp.update',
  HACCP_APPROVE: 'haccp.approve',

  // Settings
  SETTINGS_VIEW: 'settings.view',
  SETTINGS_UPDATE: 'settings.update',

  // Tasks
  TASKS_VIEW: 'tasks.view',
  TASKS_ASSIGN: 'tasks.assign',

  // Audit
  AUDIT_VIEW: 'audit.view',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
