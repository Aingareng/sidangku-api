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
  panitera_name?: string;
  panitera_pengganti_name?: string;
  agenda: string[];
  judges: string[];
  plaintiff: string[];
  defendant: string[];
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
