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
        GROUP_CONCAT(DISTINCT CASE WHEN cp.role_id = 6 THEN u.name END) as penggugat,
        GROUP_CONCAT(DISTINCT CASE WHEN cp.role_id = 7 THEN u.name END) as tergugat,
        GROUP_CONCAT(DISTINCT CASE WHEN cp.role_id = 1 THEN u.name END) as hakim,
        MAX(CASE WHEN cp.role_id = 2 THEN u.name END) as panitera
      FROM schedules s
      JOIN case_parties cp ON cp.case_id = s.cases_parties_id
      JOIN cases c ON c.id = cp.case_id
      JOIN users u ON u.id = cp.user_id 
      JOIN roles r ON r.id = cp.role_id
      ${whereClause}
      GROUP BY 
        s.id, 
        s.scheduled_date, 
        s.scheduled_time, 
        s.location, 
        s.queue_number, 
        s.status,
        c.case_number,
        c.status,
        c.case_detail
    `;

      const result = await ScheduleModel.sequelize?.query(baseQuery, {
        replacements,
        type: QueryTypes.SELECT,
      });

      // Format data sesuai kebutuhan
      const formattedData = (result as ISchedulesData[])?.map(
        (item: ISchedulesData) => ({
          id: item.id,
          scheduled_date: item.scheduled_date,
          scheduled_time: item.scheduled_time,
          case_number: item.case_number,
          agenda: item.agenda ? item.agenda.split(",") : [],
          plaintiff: item.plaintiff ? item.plaintiff.split(",") : [],
          defendant: item.defendant ? item.defendant.split(",") : [],
          judge: item.judge ? item.judge.split(",") : [],
          panitera: item.panitera,
          queue_number: item.queue_number,
          location: item.location,
        })
      );

      return {
        status: 200,
        message: "success",
        data: formattedData,
      };
    } catch (error) {
      return {
        status: 500,
        message: "Internal server error",
        data: null,
      };
    }
  }
  // async get(params: QueryParams<SehceduleQueryParams>): Promise<IApiResponse> {
  //   try {
  //     const { search } = params;
  //     let whereConditions: string[] = [];
  //     let replacements: any = {};

  //     // Kondisi search
  //     if (search) {
  //       whereConditions.push(`
  //         (c.case_number LIKE :searchTerm)
  //       `);
  //       replacements.searchTerm = `%${search}%`;
  //     }

  //     const whereClause =
  //       whereConditions.length > 0
  //         ? `WHERE ${whereConditions.join(" AND ")}`
  //         : "";

  //     const baseQuery = `
  //       SELECT
  //         s.scheduled_date,
  //         s.scheduled_time,
  //         s.location,
  //         s.queue_number,
  //         s.status,
  //         c.case_number,
  //         c.status as case_status,
  //         c.case_detail as agenda,
  //         u.name as user_name,
  //         r.name as role_name

  //       FROM schedules s
  //       JOIN cases c ON s.case_id = c.id
  //       JOIN case_parties cp ON cp.case_id = c.id
  //       JOIN users u ON cp.user_id = u.id
  //       JOIN roles r ON cp.role_id = r.id

  //       ${whereClause}

  //     `;

  //     const result = await ScheduleModel.sequelize?.query(baseQuery, {
  //       replacements,
  //       type: QueryTypes.SELECT,
  //     });

  //     return {
  //       status: 200,
  //       message: "success",
  //       data: result,
  //     };
  //   } catch (error) {
  //     return {
  //       status: 500,
  //       message: "Internal server error",
  //       data: null,
  //     };
  //   }
  // }
}

export default SchedulesController;
