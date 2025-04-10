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
  plaintiff: number[];
  defendant: number[];
  location?: number;
  queue_number?: number;
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
