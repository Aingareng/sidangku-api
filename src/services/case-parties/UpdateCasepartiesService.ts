import { Transaction } from "sequelize";
import { CasePartiesModel } from "../../models";
import { ICasePartiesService } from "../../interface/caseParties";
import { Op } from "sequelize";

class UpdateCasepartiesService {
  static async call(
    payload: Partial<ICasePartiesService>,
    transaction?: Transaction
  ) {
    try {
      // Validasi data yang akan diupdate
      const { case_id, user_id, role_id } = payload;

      // Cek apakah data yang akan diupdate ada
      const existingData = await CasePartiesModel.findOne({
        where: {
          case_id,
        },
      });
      if (!existingData) {
        return {
          status: 404,
          message: "Case party not found",
          data: null,
        };
      }

      // Jika ada perubahan pada case_id, user_id, atau role_id, validasi kombinasi baru
      if (case_id || user_id || role_id) {
        const newCaseId = case_id || existingData.case_id;
        const newUserId = user_id || existingData.user_id;
        const newRoleId = role_id || existingData.role_id;

        const validateResult = await this.validateUpdate(
          newCaseId,
          newUserId,
          newRoleId
        );
        if (validateResult.status !== 200) {
          return {
            status: 400,
            message: validateResult.message,
            data: null,
          };
        }
      }

      // Lakukan update
      const [affectedCount] = await CasePartiesModel.update(payload, {
        where: { case_id: case_id },
        transaction,
      });

      if (affectedCount === 0) {
        return {
          status: 400,
          message: "Failed to update case party",
          data: null,
        };
      }

      // Ambil data yang sudah diupdate
      // const updatedData = await CasePartiesModel.findByPk(id, { transaction });

      return {
        status: 200,
        message: "Updated successfully",
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

  private static async validateUpdate(
    case_id: number | number[],
    user_id: number | number[],
    role_id: number | number[]
  ) {
    // Cek apakah kombinasi baru sudah ada di record lain
    const existingCaseParties = await CasePartiesModel.findOne({
      where: {
        case_id,
        user_id,
        role_id,
        // id: { [Op.ne]: id }, // Exclude current record
      },
    });

    if (existingCaseParties) {
      return {
        status: 400,
        message: "Case parties combination already exists",
        data: null,
      };
    }

    return {
      status: 200,
      message: "Case parties is valid for update",
      data: null,
    };
  }

  // ... (method-method lainnya tetap dipertahankan)
}

export default UpdateCasepartiesService;
