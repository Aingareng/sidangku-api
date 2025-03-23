import { IApiResponse } from "../interface/apiResponse";
import { CasesPayload, ICasesController } from "../interface/case";
import { CaseModel } from "../models";

class casesController implements ICasesController {
  async create(payload: CasesPayload): Promise<IApiResponse> {
    try {
      const existingCase = await CaseModel.findOne({
        where: { case_number: payload.case_number },
      });

      if (existingCase) {
        return {
          status: 400,
          message: "Case number already exists",
          data: null,
        };
      }

      const data: CasesPayload = {
        ...payload,
        status: "planing",
      };

      const result = await CaseModel.create({ ...data });

      return {
        status: 200,
        message: "created",
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
}

export default casesController;
