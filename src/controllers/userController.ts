import { IApiResponse, QueryParams } from "../interface/apiResponse";
import { SequelizeValidationError } from "../interface/sequelizeValidationError";
import { IUserController, IUserData, UserQueryParams } from "../interface/user";
import { CasePartiesModel, UserModel } from "../models";
import { Op, QueryTypes } from "sequelize";

import CasePartiesService from "../services/case-parties/CasePartiesService";
import DestroyUsersSerive from "../services/users/DestroyUsersService";

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
      const { search, role_id } = params;

      let whereConditions: string[] = [];
      let replacements: any = {};

      // Kondisi search
      if (search) {
        whereConditions.push(`
          (u.name LIKE :searchTerm
          OR u.email LIKE :searchTerm
          OR u.phone LIKE :searchTerm)
        `);
        replacements.searchTerm = `%${search}%`;
      }

      // Kondisi role_id
      if (role_id) {
        whereConditions.push("u.role_id = :roleId");
        replacements.roleId = role_id;
      }

      const whereClause =
        whereConditions.length > 0
          ? `WHERE ${whereConditions.join(" AND ")}`
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
        replacements,
        type: QueryTypes.SELECT,
      });

      return {
        status: 200,
        message: "Success",
        data: (results as IUserData[])?.filter(
          (result: IUserData) => result.name.toLowerCase() !== "admin"
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

  async delete(id: number) {
    try {
      const destroyUserService = await DestroyUsersSerive.call(id);

      return {
        status: destroyUserService.status,
        message: destroyUserService.message,
        data: destroyUserService.data,
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

export default userController;
