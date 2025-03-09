import { HttpStatusCode } from "../types/httpCode";

export type QueryParams<T> = T;

export interface IApiResponse {
  status?: HttpStatusCode;
  message?: string;
  data?: Record<string, any> | null;
}
