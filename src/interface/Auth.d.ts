import { IApiResponse } from "./apiResponse";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthController {
  login(payload: LoginPayload): Promise<IApiResponse>;
}
