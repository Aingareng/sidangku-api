import { IApiResponse, QueryParams } from "../interface/apiResponse";
import { IUserController, IUserData, UserQueryParams } from "../interface/user";

class UserController implements IUserController {
  async create(payload: IUserData): Promise<IApiResponse> {
    try {
      return {
        status: 100,
        message: "",
        data: null,
      };
    } catch (error) {
      return {
        status: 500,
        message: "Internal server error",
        data: null,
      };
    }
  }

  async get(params: QueryParams<UserQueryParams>): Promise<IApiResponse> {
    try {
      return {
        status: 200,
        message: "Success",
        data: null,
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

export default UserController;
