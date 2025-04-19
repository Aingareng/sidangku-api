export interface SequelizeValidationError {
  name: string;
  errors: ValidationErrorDetail[];
}

interface ValidationErrorDetail {
  message: string;
  type: string;
  path: string;
  value: any;
  origin: string;
  instance: InstanceData;
  validatorKey: string;
  validatorName: string | null;
  validatorArgs: any[];
}

interface ISchedulesPayload {
  case_number: string;
  registrar: number;
  case_detail: string[];
  judges: number[];
  plaintiffs?: number[];
  defendants?: number[];
  preacheds?: number[];
  location?: number;
  queue_number?: number;
  case_type: "perdata" | "pidana";
}

interface InstanceData {
  id: number | null;
  role_id: string;
  name: string;
  email: string;
  phone: string;
  updatedAt: string;
  createdAt: string;
}
