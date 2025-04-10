import {
  CaseModel,
  CasePartiesModel,
  ScheduleModel,
  sequelize,
} from "../../models";

class DestroySchedulesService {
  static async call(id: string) {
    const transaction = await sequelize.transaction();
    try {
      // 1. Check pakah schedule ada
      const schedule = await ScheduleModel.findByPk(id);
      if (!schedule) {
        transaction.rollback();
        return {
          status: 404,
          message: "Schedule not found",
          data: null,
        };
      }

      //2. Hapus schedule
      const scheduleDestroyResult = await ScheduleModel.destroy({
        where: {
          id,
        },
        transaction,
      });

      // 3. Jika schedule berhasil dihapus, hapus data pada table cases_parties berdasarkan case_id
      const caseId = schedule.case_id;
      if (scheduleDestroyResult > 0) {
        // Hapus data pada table cases_parties berdasarkan case_id
        const casePartiesDestroyResult = await CasePartiesModel.destroy({
          where: {
            case_id: caseId,
          },
          transaction,
        });

        const CasesDestroyResult = await CaseModel.destroy({
          where: {
            id: caseId,
          },
          transaction,
        });

        if (casePartiesDestroyResult > 0 && CasesDestroyResult > 0) {
          // Commit the transaction if all deletions were successful
          transaction.commit();
        } else {
          // Rollback the transaction if any deletion failed
          transaction.rollback();
          return {
            status: 500,
            message: "Failed to delete case parties & case",
            data: null,
          };
        }
      } else {
        transaction.rollback();
        return {
          status: 500,
          message: "Failed to delete schedule",
          data: null,
        };
      }

      return {
        status: 201,
        message: "Schedule deleted successfully",
        data: null,
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

export default DestroySchedulesService;
