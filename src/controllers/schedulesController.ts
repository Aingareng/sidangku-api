import { IApiResponse, QueryParams } from "../interface/apiResponse";
import {
  ISchedulesController,
  ISchedulesData,
  SehceduleQueryParams,
} from "../interface/schedules";
import { ISchedulesPayload } from "../interface/sequelizeValidationError";

class SchedulesController implements ISchedulesController {
  async create(payload: ISchedulesPayload): Promise<IApiResponse> {
    try {
      return {
        status: 100,
        message: "created",
        data: null,
      };
    } catch (error) {
      return {
        status: 500,
        message: "Internal server error",
        data: null,
      };
    }
  }
  async get(params: QueryParams<SehceduleQueryParams>): Promise<IApiResponse> {
    try {
      return {
        status: 100,
        message: "success",
        data: null,
      };
    } catch (error) {
      return {
        status: 500,
        message: "Internal server error",
        data: null,
      };
    }
  }
}

export default SchedulesController;
