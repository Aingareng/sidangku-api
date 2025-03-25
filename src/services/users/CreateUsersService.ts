import { IUserPayload } from "../../interface/user";
import { UserModel } from "../../models";

class CreateUserService {
  static async create(payload: IUserPayload) {
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
      const result = await UserModel.create(data);
      return {
        status: 201,
        message: "created",
        data: result,
      };
    } catch (error) {}
  }

  static async validation(payload: any) {
    return { error: "" };
  }
}

export default CreateUserService;
