import { QueryInterface } from "sequelize";
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          name: "terdakwa",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete(
      "roles",
      {
        name: ["terdakwa"],
      },
      {}
    );
  },
};
