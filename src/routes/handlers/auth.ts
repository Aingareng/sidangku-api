import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
import { UserModel } from "../../models";
import { RoleModel } from "../../models/role.model";
import loginController from "../../controllers/loginController";
import { HttpStatusCode } from "../../types/httpCode";

const authRoute = () => {
  const router: Router = Router();
  const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";
  const controller: loginController = new loginController();

  router.post("/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body as {
        email: string;
        password: string;
      };

      const result = await controller.login({ email, password });
      // bcrypt.hash("password123", 10).then((hash) => console.log(hash));

      // const isMatch = await bcrypt.compare(
      //   password,
      //   existingUser?.password as string
      // );

      // const token = jwt.sign(
      //   {
      //     id: existingUser?.id,
      //     email: existingUser?.email,
      //   },
      //   JWT_SECRET,
      //   { expiresIn: "1h" } // Token berlaku 1 jam
      // );

      res.status(result.status as HttpStatusCode).json({
        status: result.status as HttpStatusCode,
        message: result.message,
        data: result.data,
        // { token: token, user_role: existingUser?.role_id },
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: 500, message: "Internal server error", data: null });
    }
  });

  return router;
};

export default authRoute;
