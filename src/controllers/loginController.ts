import { IApiResponse } from "../interface/apiResponse";
import { AuthController, LoginPayload } from "../interface/Auth";
import { UserModel } from "../models";
import { RoleModel } from "../models/role.model";

class loginController implements AuthController {
  async login(payload: LoginPayload): Promise<IApiResponse> {
    try {
      const existingUser = await UserModel.findOne({
        where: { email: payload.email },
      });

      if (!existingUser) {
        return {
          status: 401,
          message: "User not found",
          data: null,
        };
      }

      const userRole = await RoleModel.findByPk(existingUser?.role_id);

      if (payload.password !== existingUser?.password) {
        return {
          status: 400,
          message: "Wrong password",
          data: null,
        };
      }

      return {
        status: 200,
        message: "success",
        data: {
          role: userRole?.name,
        },
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

export default loginController;
