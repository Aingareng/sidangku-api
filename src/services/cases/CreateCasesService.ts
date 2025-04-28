import { Transaction } from "sequelize";
import { CasesPayload } from "../../interface/case";
import { CaseModel, ScheduleModel } from "../../models";

class CreateCasesService {
  static async create(payload: CasesPayload, transaction: Transaction) {
    try {
      const validateResult = (await this.validation(payload)) as {
        error: string;
      };

      console.log(
        "🚀 ~ CreateCasesService ~ validateResult ~ validateResult:",
        validateResult
      );
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

      const CreateCaseResult = await CaseModel.create(data, { transaction });

      if (!CreateCaseResult) {
        return {
          status: 400,
          message: "Gagal membuat perkara",
          data: null,
        };
      }

      return {
        status: 201,
        message: "created",
        data: CreateCaseResult,
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
      error = "Nomor perkara tidak boleh kosong";
    }

    if (existingCase) {
      error = "Nomor perkara sudah terdaftar";
    }

    return { error };
  }
}

export default CreateCasesService;
