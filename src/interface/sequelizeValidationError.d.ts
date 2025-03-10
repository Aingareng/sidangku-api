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

interface InstanceData {
  id: number | null;
  role_id: string;
  name: string;
  email: string;
  phone: string;
  updatedAt: string;
  createdAt: string;
}
