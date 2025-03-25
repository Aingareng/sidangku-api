import { ISchedulesPayload } from "../../interface/sequelizeValidationError";
import { sequelize } from "../../models";
import CreateCasesService from "../cases/CreateCasesService";

class CreateSchedulesService {
  static async create(payload: ISchedulesPayload) {
    const transaction = await sequelize.transaction();
    try {
      const {
        agenda,
        defendant,
        judges,
        plaintiff,
        case_number,
        panitera_name,
        panitera_pengganti_name,
      } = payload;

      const caseService = await CreateCasesService.create({ case_number });

      if (caseService?.status !== 201) {
        await transaction.rollback();
        return {
          status: 400,
          message: caseService?.message,
          data: null,
        };
      }

      transaction.commit();
      return {
        status: 201,
        message: "created",
        data: null,
      };
    } catch (error) {
      return {
        status: 500,
        message: error,
        data: null,
      };
    }
  }
}

export default CreateSchedulesService;
