import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../../models";

const authRoute = () => {
  const router: Router = Router();
  const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

  router.post("/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body as {
        email: string;
        password: string;
      };
      // bcrypt.hash("1234567", 10).then((hash) => console.log(hash));
      const existingUser = await UserModel.findOne({ where: { email: email } });
      if (!existingUser) {
        res
          .status(401)
          .json({ status: 401, message: "User not found", data: null });
      }

      const isMatch = await bcrypt.compare(
        password,
        existingUser?.password as string
      );
      if (!isMatch) {
        res
          .status(401)
          .json({ status: 401, message: "Wrong password", data: null });
      }

      const token = jwt.sign(
        {
          id: existingUser?.id,
          email: existingUser?.email,
        },
        JWT_SECRET,
        { expiresIn: "1h" } // Token berlaku 1 jam
      );

      res
        .status(200)
        .json({ status: 200, message: "success", data: { token: token } });
    } catch (error) {
      res
        .status(500)
        .json({ status: 500, message: "Internal server error", data: null });
    }
  });

  return router;
};

export default authRoute;
