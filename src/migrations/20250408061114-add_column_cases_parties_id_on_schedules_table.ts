import { QueryInterface, DataTypes } from "sequelize";
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn("schedules", "cases_parties_id", {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "case_parties",
        key: "id",
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn("schedules", "cases_parties_id");
  },
};
