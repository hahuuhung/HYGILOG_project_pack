import { RoleType } from './roles';

export interface Organization {
  id: string;
  name: string;
  code: string;
  address?: string;
  contactEmail: string;
  contactPhone?: string;
  isActive: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface Site {
  id: string;
  organizationId: string;
  name: string;
  timezone: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  organizationId: string;
  siteIds: string[]; // For users restricted to specific sites
  email: string;
  firstName: string;
  lastName: string;
  role: RoleType;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemperatureRecord {
  id: string;
  organizationId: string;
  siteId: string;
  recordedBy: string; // User ID
  equipmentId: string;
  temperature: number;
  unit: 'C' | 'F';
  isCompliant: boolean;
  recordedAt: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  question: string;
  type: 'boolean' | 'text' | 'number' | 'options';
  options?: string[]; // If type is options
  required: boolean;
}

export interface ChecklistTemplate {
  id: string;
  organizationId: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'as_needed';
  items: ChecklistItem[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Checklist {
  id: string;
  organizationId: string;
  siteId: string;
  templateId: string;
  completedBy: string; // User ID
  approvedBy?: string; // User ID
  status: 'draft' | 'completed' | 'approved' | 'rejected';
  answers: Record<string, any>; // key: item ID, value: answer
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Batch {
  id: string;
  organizationId: string;
  siteId: string;
  batchNumber: string;
  productName: string;
  supplier?: string;
  receivedAt: string;
  expiryDate?: string;
  quantity: number;
  unit: string;
  status: 'active' | 'consumed' | 'discarded';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CorrectiveAction {
  id: string;
  organizationId: string;
  siteId: string;
  reportedBy: string; // User ID
  assignedTo?: string; // User ID
  issueDescription: string;
  actionTaken?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  relatedRecordId?: string; // Link to TemperatureRecord or Checklist
  relatedRecordType?: 'temperature' | 'checklist';
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NfcTag {
  id: string;
  organizationId: string;
  siteId: string;
  tagId: string; // Physical NFC chip ID
  name: string;
  location: string;
  assignedType: 'equipment' | 'location' | 'user';
  assignedId?: string; // ID of the equipment/location/user
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NfcScan {
  id: string;
  organizationId: string;
  siteId: string;
  tagId: string;
  scannedBy: string; // User ID
  scannedAt: string;
  action: 'check_in' | 'temperature_log' | 'checklist_start' | 'other';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface RefreshToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  isRevoked: boolean;
  createdAt: string;
  updatedAt: string;
}
