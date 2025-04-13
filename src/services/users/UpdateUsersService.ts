import { IApiResponse } from "../../interface/apiResponse";
import { IUserData } from "../../interface/user";
import { UserModel } from "../../models";
import FindUserService from "./FindUserService";

class UpdateUsersService {
  static async call(id: number, payload: IUserData) {
    try {
      const user = (await FindUserService.findByPk(id)) as IApiResponse;

      if (user.status !== 200) {
        return {
          status: user.status,
          message: user.message,
          data: user.data,
        };
      }

      await UserModel.update(payload, { where: { id } });
    } catch (error) {
      return {
        status: 500,
        message: String(error),
        data: null,
      };
    }
  }
}

export default UpdateUsersService;
