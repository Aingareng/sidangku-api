import { QueryInterface } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.removeColumn("schedules", "case_id");
    await queryInterface.removeColumn("schedules", "judge_id");
    await queryInterface.removeColumn("schedules", "panitera_id");
    await queryInterface.removeColumn("schedules", "panitera_pengganti_id");
  },

  async down(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.addColumn("schedules", "case_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "cases",
        key: "id",
      },
    });

    await queryInterface.addColumn("schedules", "judge_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    });

    await queryInterface.addColumn("schedules", "panitera_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    });

    await queryInterface.addColumn("schedules", "panitera_pengganti_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    });
  },
};
