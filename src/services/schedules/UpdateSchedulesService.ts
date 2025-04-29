import { where } from "sequelize";
import { ISchedulesPayload } from "../../interface/sequelizeValidationError";
import { CaseModel, ScheduleModel, sequelize } from "../../models";
import { CasesPayload } from "../../interface/case";
import FindUserService from "../users/FindUserService";
import UpdateCasepartiesService from "../case-parties/UpdateCasepartiesService";
import SendNoticationService from "../whats-app/SendNoticationService";
import {
  formatJamIndonesia,
  formatTanggalIndonesia,
} from "../../utils/formatDate";

class UpdateSchedulesService {
  static async call(id: string, data: ISchedulesPayload) {
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

      const queueExisting = await ScheduleModel.findOne({
        where: { queue_number: data.queue_number },
      });

      if (queueExisting && schedule.id !== queueExisting.id) {
        transaction.rollback();
        return {
          status: 400,
          message: "Nomor antrian tidak boleh sama",
          data: null,
        };
      }

      // 2 Jika schedule true, update data pada table case & cases_parties

      // Update table cases_parties
      const processParties = async (userIds: number[], roleType: string) => {
        for (const userId of userIds) {
          const user = await FindUserService.findByPk(userId, transaction);

          if (user.status !== 200)
            return {
              status: 400,
              message: user.message || `${roleType} not found`,
              data: null,
            };

          return await UpdateCasepartiesService.call(
            {
              case_id: schedule.case_id,
              user_id: userId,
              role_id: user.data?.role_id,
            },
            transaction
          );
        }
      };

      await processParties(data.judges, "Judge");
      await processParties(data.plaintiffs || [], "Plaintiff");
      await processParties(data.defendants || [], "Defendant");
      await processParties(data.preacheds || [], "preacheds");
      // await processParties([data.registrar], "registrar");

      const scheduleUpdateResult = await ScheduleModel.update(data, {
        where: {
          id: schedule.id,
        },
        transaction,
      });

      // update table cases
      const caseDataUpdate = {
        ...data,
        case_number: data.case_number,
        case_detail: String(data.case_detail),
      };
      const caseUpdateResult = await CaseModel.update(
        caseDataUpdate, // Data to update
        {
          where: {
            id: schedule.case_id,
          },
          transaction,
        }
      );

      if (!scheduleUpdateResult && !caseUpdateResult) {
        await transaction.rollback();

        return {
          status: 400,
          message: "failed update scheduled",
          data: null,
        };
      }

      const judges = await FindUserService.findAll(data.judges);
      const plaintiffs = await FindUserService.findAll(data.plaintiffs || []);
      const defendants = await FindUserService.findAll(data.defendants || []);
      const preacheds = await FindUserService.findAll(data.preacheds || []);

      await transaction.commit();

      await SendNoticationService(
        `
📢 *Jadwal Sidang Baru*

🆔 *Perkara*: ${data.case_number}
👨‍⚖️ *Hakim*: 
${judges.data
  ?.map(
    (judge, idx) =>
      `${idx + 1}. ${judge.name} (📞 https://wa.me/${judge.phone})`
  )
  .join("\n")}

${
  data.case_type === "perdata"
    ? `
👥 *Penggugat*: 
${plaintiffs.data
  ?.map((p, idx) => `${idx + 1}. ${p.name} (📞 https://wa.me/${p.phone})`)
  .join("\n")}

👥 *Tergugat*: 
${defendants.data
  ?.map((d, idx) => `${idx + 1}. ${d.name} (📞 https://wa.me/${d.phone})`)
  .join("\n")}
    `
    : `
👥 *Terdakwa*:
${preacheds.data?.map((p, idx) => `${idx + 1}. ${p.name} `).join("\n")}
    `
}

📅 *Tanggal*: ${formatTanggalIndonesia(schedule.createdAt.toString())}
⏰ *Jam*: ${schedule.scheduled_time}
🏛 *Ruang Sidang*: ${data.location}
🔢 *Nomor Antrian*: ${data.queue_number}

📝 *Tindakan:*
Mohon hadir tepat waktu sesuai jadwal yang telah ditentukan.

🔗 *Dashboard*: 
👉 http://192.168.1.5/

_Terima kasih atas kerjasama Bapak/Ibu._

Salam hormat,  
*PTSP PN Limboto*
  `
      );

      return {
        status: 201,
        message: "Updated",
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

export default UpdateSchedulesService;
