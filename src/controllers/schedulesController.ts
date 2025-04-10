import { Op, QueryTypes } from "sequelize";
import { IApiResponse, QueryParams } from "../interface/apiResponse";
import {
  ISchedulesController,
  ISchedulesData,
  SehceduleQueryParams,
} from "../interface/schedules";
import { ISchedulesPayload } from "../interface/sequelizeValidationError";
import { ScheduleModel } from "../models";
import CreateSchedulesService from "../services/schedules/CreateSchedulesService";
import { HttpStatusCode } from "../types/httpCode";
import DestroySchedulesService from "../services/schedules/DestroySchedulesService";
import UpdateSchedulesService from "../services/schedules/UpdateSchedulesService";

class SchedulesController implements ISchedulesController {
  async create(payload: ISchedulesPayload): Promise<IApiResponse> {
    try {
      const data = {
        ...payload,
        status: "scheduled",
        scheduled_date: new Date(),
        scheduled_time: new Date().getTime(),
        createdAt: new Date(),
      };
      const result = await CreateSchedulesService.create(data);

      return {
        status: result.status as HttpStatusCode,
        message: result.message as string,
        data: result.data,
      };
    } catch (error) {
      return {
        status: 500,
        message: String(error),
        data: null,
      };
    }
  }
  async get(params: QueryParams<SehceduleQueryParams>): Promise<IApiResponse> {
    try {
      const { search } = params;
      let whereConditions: string[] = [];
      let replacements: any = {};

      // Kondisi search
      if (search) {
        whereConditions.push(`(c.case_number LIKE :searchTerm)`);
        replacements.searchTerm = `%${search}%`;
      }

      const whereClause =
        whereConditions.length > 0
          ? `WHERE ${whereConditions.join(" AND ")}`
          : "";

      const baseQuery = `
      SELECT
        s.id,
        s.scheduled_date,
        s.scheduled_time,
        s.location,
        s.queue_number,
        s.status,
        c.case_number,
        c.status as case_status,
        c.case_detail as agenda,

        -- Ambil daftar hakim (role_id = 1)
        (
          SELECT JSON_ARRAYAGG(u.name)
          FROM case_parties cp
          JOIN users u ON u.id = cp.user_id
          WHERE cp.case_id = s.case_id AND cp.role_id = 1
        ) as judges,

        -- Ambil daftar penggugat (role_id = 6)
        (
          SELECT JSON_ARRAYAGG(u.name)
          FROM case_parties cp
          JOIN users u ON u.id = cp.user_id
          WHERE cp.case_id = s.case_id AND cp.role_id = 6
        ) as plaintiffs,

        -- Ambil daftar tergugat (role_id = 7)
        (
          SELECT JSON_ARRAYAGG(u.name)
          FROM case_parties cp
          JOIN users u ON u.id = cp.user_id
          WHERE cp.case_id = s.case_id AND cp.role_id = 7
        ) as defendants,

        -- Ambil panitera (role_id = 2)
        (
          SELECT u.name
          FROM case_parties cp
          JOIN users u ON u.id = cp.user_id
          WHERE cp.case_id = s.case_id AND cp.role_id = 2
          LIMIT 1
        ) as registrar

      FROM schedules s
      JOIN cases c ON c.id = s.case_id
      ${whereClause}
      ORDER BY s.scheduled_date;
    `;

      const result = await ScheduleModel.sequelize?.query(baseQuery, {
        replacements,
        type: QueryTypes.SELECT,
      });

      return {
        status: 200,
        message: "success",
        data: result,
      };
    } catch (error) {
      return {
        status: 500,
        message: "Internal server error",
        data: null,
      };
    }
  }
  async delete(id: string): Promise<IApiResponse> {
    try {
      const result = await DestroySchedulesService.call(id);

      if (result.status !== 201) {
        return {
          status: result.status as HttpStatusCode,
          message: result.message,
          data: null,
        };
      }

      return {
        status: 200,
        message: "Schedule deleted successfully",
        data: null,
      };
    } catch (error) {
      return {
        status: 500,
        message: String(error),
        data: null,
      };
    }
  }
  async update(id: string, payload: ISchedulesPayload): Promise<IApiResponse> {
    try {
      const result = await UpdateSchedulesService.call(id, payload);

      if (result.status !== 201) {
        return {
          status: result.status as HttpStatusCode,
          message: result.message,
          data: null,
        };
      }

      return {
        status: 200,
        message: "Schedule updated successfully",
        data: null,
      };
    } catch (error) {
      return {
        status: 500,
        message: String(error),
        data: null,
      };
    }
  }
}

export default SchedulesController;
