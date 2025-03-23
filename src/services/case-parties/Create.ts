import { CasePartiesModel } from "../../models";

export interface ICasePartiesService {
  case_id?: number;
  user_id?: number;
  role_id?: number;
}

class CasePartiesService {
  static async create(payload: ICasePartiesService) {
    try {
      const { user_id, role_id } = payload;

      const result = await CasePartiesModel.create();
    } catch (error) {}
  }
}

export default CasePartiesService;
