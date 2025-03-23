import { IApiResponse, QueryParams } from "../interface/apiResponse";
import { SequelizeValidationError } from "../interface/sequelizeValidationError";
import { IUserController, IUserData, UserQueryParams } from "../interface/user";
import { CasePartiesModel, UserModel } from "../models";
import { Op } from "sequelize";
import CasePartiesService from "../services/case-parties/Create";

class userController implements IUserController {
  async create(payload: IUserData): Promise<IApiResponse> {
    try {
      const data: IUserData = {
        ...payload,
        createdAt: new Date(),
      };

      const existingUser = await UserModel.findOne({
        where: { email: payload.email },
      });
      if (existingUser) {
        return {
          status: 409,
          message: "User is already registered",
          data: null,
        };
      }

      const user = await UserModel.create({ ...data });

      if (!user) {
        return {
          status: 400,
          message: "Failed to add user",
          data: null,
        };
      }

      const casePartiesResult = await CasePartiesService.create({
        user_id: user.id,
        role_id: user.role_id,
      });
      // await CasePartiesModel.create()

      return {
        status: 201,
        message: "Created",
        data: null,
      };
    } catch (error) {
      return {
        status: 500,
        message: "Internal server error",
        data: error as SequelizeValidationError,
      };
    }
  }

  async get(params: QueryParams<UserQueryParams>): Promise<IApiResponse> {
    try {
      const whereClause: any = {};
      const { search, id } = params;
      let result;
      if (!search && id) {
        whereClause.id = id;

        result = await UserModel.findOne({ where: whereClause });
      }

      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } },
        ];
      }
      result = await UserModel.findAll({ where: whereClause });

      return {
        status: 200,
        message: "Success",
        data: result,
      };
    } catch (error) {
      return {
        status: 500,
        message: "Internal server error",
        data: error as SequelizeValidationError,
      };
    }
  }
}

export default userController;
