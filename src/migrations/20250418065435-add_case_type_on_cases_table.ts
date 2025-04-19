import { QueryInterface, DataTypes } from "sequelize";
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn("cases", "case_type", {
      type: DataTypes.ENUM("perdata", "pidana"),
      allowNull: false,
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn("cases", "case_type");
  },
};
