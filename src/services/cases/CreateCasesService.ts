import { CasesPayload } from "../../interface/case";
import { CaseModel } from "../../models";

class CreateCasesService {
  static async create(payload: CasesPayload) {
    try {
      const validateResult = (await this.validation(payload)) as {
        error: string;
      };

      if (validateResult.error.length > 0) {
        return {
          status: 400,
          message: validateResult.error,
          data: null,
        };
      }

      const data = {
        ...payload,
        status: "planing",
        createAt: new Date(),
      };

      const result = await CaseModel.create(data);

      return {
        status: 201,
        message: "created",
        data: result,
      };
    } catch (error) {
      return {
        status: 500,
        message: error,
        data: null,
      };
    }
  }

  static async validation(payload: CasesPayload) {
    const existingCase = await CaseModel.findOne({
      where: { case_number: payload.case_number },
    });
    let error = "";

    if (payload.case_number.length === 0) {
      error = "Case number is required";
    }

    if (existingCase) {
      error = "Case number already exists";
    }

    return { error };
  }
}

export default CreateCasesService;
