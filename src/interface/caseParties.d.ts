export interface ICasePartiesTable {
  id?: number;
  case_id: number;
  user_id: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface ICasePartiesService {
  case_id?: number | number[];
  user_id?: number | number[];
  role_id?: number | number[];
}
