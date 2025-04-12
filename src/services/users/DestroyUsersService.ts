import { CasePartiesModel, sequelize, UserModel } from "../../models";

class DestroyUsersSerive {
  static async call(id: number) {
    const transaction = await sequelize.transaction();
    try {
      // 1. Cek apakah user dengan id tersebut tersedia
      const isUserExist = await UserModel.findByPk(id);
      // 2. Cek apakah user tersebut sudah mempunyai tugas di suatu kasus tertentu, jika ada maka user tidak boleh dihapus
      const userOnDuty = await CasePartiesModel.findOne({
        where: { user_id: isUserExist?.id },
      });
      if (userOnDuty) {
        transaction.rollback();
        return {
          status: 400,
          message:
            "User cannot be deleted because they are assigned to an active case.",
          data: null,
        };
      }
      // 3. Hapus user dengan id terebut
      if (isUserExist) {
        await isUserExist.destroy();
      }

      transaction.commit();

      return {
        status: 201,
        message: "Deleted",
        data: null,
      };
    } catch (error) {
      transaction.rollback();
      return {
        status: 500,
        message: String(error),
        data: null,
      };
    }
  }
}

export default DestroyUsersSerive;
