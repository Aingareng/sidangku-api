import { IApiResponse, QueryParams } from "./apiResponse";
import { ISchedulesPayload } from "./sequelizeValidationError";
import { IUserData } from "./user";

export interface ISchedulesData {
  id: number;
  scheduled_date: string;
  scheduled_time: string;
  case_number: string;
  plaintiff: string[];
  queue_number?: number;
  location?: number;
  defendant: string[];
  judge: string[];
  panitera: string;
  agenda: string[];
}

interface SehceduleQueryParams {
  search?: string;
  id?: number;
}

export interface ISchedulesController {
  get(params: QueryParams<SehceduleQueryParams>): Promise<IApiResponse>;
  create(payload: ISchedulesPayload): Promise<IApiResponse>;
  update(id: string, payload: ISchedulesPayload): Promise<IApiResponse>;
  delete(id: string): Promise<IApiResponse>;
}
