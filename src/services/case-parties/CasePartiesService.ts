import { Transaction } from "sequelize";
import { CasePartiesModel } from "../../models";
import { ICasePartiesService } from "../../interface/caseParties";

class CasePartiesService {
  static async create(payload: ICasePartiesService, transaction?: Transaction) {
    try {
      const { case_id, user_id, role_id } = payload;

      const validateResult = await this.validaton(payload);
      if (validateResult.status !== 200) {
        return {
          status: 400,
          message: validateResult.message,
          data: null,
        };
      }

      const result = await CasePartiesModel.create(
        {
          case_id,
          user_id,
          role_id,
        },
        { transaction }
      );

      if (!result) {
        return {
          status: 400,
          message: "failed to create case parties",
          data: null,
        };
      }

      return {
        status: 201,
        message: "created",
        data: result,
      };
    } catch (error) {
      return {
        status: 500,
        message: String(error),
        data: null,
      };
    }
  }

  static async bulkCreate(payload: ICasePartiesService[]) {
    try {
      const transformedPayload = payload.map((item) => ({
        case_id: item.case_id,
        user_id: item.user_id,
        role_id: item.role_id,
      }));

      const result = await CasePartiesModel.bulkCreate(transformedPayload, {
        ignoreDuplicates: true,
      });
      return {
        status: 201,
        message: "created",
        data: result,
      };
    } catch (error) {
      return {
        status: 500,
        message: String(error),
        data: null,
      };
    }
  }

  static async validaton(payload: ICasePartiesService) {
    const { case_id, user_id, role_id } = payload;

    const existingCaseParties = await CasePartiesModel.findOne({
      where: {
        case_id,
        user_id,
        role_id,
      },
    });

    if (existingCaseParties) {
      return {
        status: 400,
        message: "case parties already exists",
        data: null,
      };
    }

    return {
      status: 200,
      message: "case parties is valid",
      data: null,
    };
  }
}

export default CasePartiesService;
