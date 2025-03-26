import { IApiResponse, QueryParams } from "../interface/apiResponse";
import { SequelizeValidationError } from "../interface/sequelizeValidationError";
import { IUserController, IUserData, UserQueryParams } from "../interface/user";
import { CasePartiesModel, UserModel } from "../models";
import { Op, QueryTypes } from "sequelize";
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
      const { search } = params;

      const whereClause = search
        ? `
            WHERE u.name  LIKE :searchTerm
              OR u.email LIKE :searchTerm
              OR u.phone LIKE :searchTerm
          `
        : "";

      const baseQuery = `
        SELECT
          u.id,
          u.name,
          u.email,
          u.phone,
          r.name AS role_name
        FROM users u
        JOIN roles r ON u.role_id = r.id
        ${whereClause}
      `;

      const results = await UserModel.sequelize?.query(baseQuery, {
        replacements: search ? { searchTerm: `%${search}%` } : {},
        type: QueryTypes.SELECT,
      });

      return {
        status: 200,
        message: "Success",
        data: (results as IUserData[])?.filter(
          (result: IUserData) => result.name !== "Admin"
        ),
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
