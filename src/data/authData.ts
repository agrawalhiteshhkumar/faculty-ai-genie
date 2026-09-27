export type SystemRole = 
  | "PLATFORM_SUPER_ADMIN"
  | "INSTITUTE_ADMIN"
  | "OFFICER_DESK";

export interface InstituteTenant {
  id: string;
  name: string;
  trustName: string;
  location: string;
  licenseKey: string;
  msbteCode: string;
  dteCode: string;
  pciCode: string;
  aisheCode: string;
  createdAt: string;
  principalName: string;
  principalEmail: string;
}

export interface InstitutionalUser {
  id: string;
  instituteId: string;
  name: string;
  email: string;
  role: SystemRole;
  designationTitle: string;
  accessPin: string;
  allowedDesks: string[];
}

export const SUPER_ADMIN_CREDENTIALS = {
  email: "hiteshhkumar.agrawal@gmail.com",
  masterPin: "9637",
};

export const STORAGE_KEYS = {
  TENANTS: "office_ai_tenants_v1",
  USERS: "office_ai_users_v1",
  REGISTERS: "office_ai_registers_v1",
  ACTIVE_SESSION: "office_ai_session_v1",
};
