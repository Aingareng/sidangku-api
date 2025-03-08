import { QueryInterface } from "sequelize";
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          name: "hakim",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "panitera",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "panitera pengganti ",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "jaksa ",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "pengacara",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "penggugat",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "tergugat",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "saksi",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "admin",
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
        name: [
          "hakim",
          "panitera",
          "panitera pengganti",
          "jaksa",
          "pengacara",
          "penggugat",
          "tergugat",
          "saksi",
          "admin",
        ],
      },
      {}
    );
  },
};
