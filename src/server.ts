import app from "./app";
import { sequelize } from "./config/database";

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // Tes koneksi database
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    // Jalankan server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
