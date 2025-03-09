import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.changeColumn("cases", "status", {
      type: DataTypes.ENUM(
        "planing",
        "pending",
        "in_progress",
        "resolved",
        "closed"
      ),
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.changeColumn("cases", "status", {
      type: DataTypes.ENUM("pending", "in_progress", "resolved", "closed"),
    });
  },
};
