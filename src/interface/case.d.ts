import { IApiResponse } from "./apiResponse";

export type ICaseSatatus =
  | "pending"
  | "planing"
  | "in_progress"
  | "resolved"
  | "closed";

export interface CasesPayload {
  case_number: number;
  case_detail?: string;
  status?: ICaseSatatus;
}

export interface ICasesController {
  create(payload: CasesPayload): Promise<IApiResponse>;
}
