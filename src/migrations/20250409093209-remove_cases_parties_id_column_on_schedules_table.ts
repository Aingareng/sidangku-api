import { QueryInterface } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.removeColumn("schedules", "cases_parties_id");
  },

  async down(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.addColumn("schedules", "cases_parties_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "cases_parties",
        key: "id",
      },
    });
  },
};
