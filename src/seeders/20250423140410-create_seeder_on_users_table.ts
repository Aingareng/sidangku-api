import { QueryInterface } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert("users", [
      {
        role_id: 9, // pastikan role dengan id 1 ada
        name: "admin",
        email: "admin@gmail.com",
        phone: "081234567890",
        password: "Pep@bri123", // sebaiknya ini hasil bcrypt
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("users", {
      email: ["admin@gmail.com", "user1@example.com"],
    });
  },
};
