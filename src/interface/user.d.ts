import { Request, Response } from "express";
import { IApiResponse, QueryParams } from "./apiResponse";

export interface IUserData {
  id: number;
  role_id: string;
  name: string;
  password: string;
  phone: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface UserQueryParams {
  search?: string;
}

export interface IUserController {
  create(payload: IUserData): Promise<IApiResponse>;
  get(params: QueryParams<UserQueryParams>): Promise<IApiResponse>;
}
