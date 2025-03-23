import { IApiResponse, QueryParams } from "./apiResponse";
import { IUserData } from "./user";

export interface ISchedulesData {
  case_id: number;
  judge_id: number;
  panitera_id: number;
  panitera_pengganti_id: number;
  queue_number?: number;
  location?: number;
}

interface SehceduleQueryParams {
  search?: string;
  id?: number;
}

export interface ISchedulesController {
  get(params: QueryParams<SehceduleQueryParams>): Promise<IApiResponse>;
  create(payload: ISchedulesData): Promise<IApiResponse>;
}
