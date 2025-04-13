import { Op, Transaction } from "sequelize";
import { IUserPayload } from "../../interface/user";
import { UserModel } from "../../models";

class FindUserService {
  static async findByPk(id: number, transaction?: Transaction) {
    try {
      const result = await UserModel.findByPk(id, { transaction });
      return {
        status: 200,
        message: "found",
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
}

export default FindUserService;
