import { Router, Request, Response } from "express";
import UserController from "../../controllers/userController";
import { IUserData } from "../../interface/user";
import { validateCreateUser } from "../middleware/user";
import authMiddleware from "../middleware/authMiddleware";
import { NextFunction } from "express";

const userRoute = () => {
  const router: Router = Router();
  const controller: UserController = new UserController();

  router.post("/", validateCreateUser, async (req: Request, res: Response) => {
    try {
      const result = await controller.create(req.body as IUserData);

      res.status(result.status as number).json(result);
    } catch (error) {
      res.status(500).json(error as Record<string, any>);
    }
  });

  router.get("/", authMiddleware, async (req: Request, res: Response) => {
    try {
      const result = await controller.get({ ...req.query });

      res.status(result.status as number).json(result);
    } catch (error) {
      res.status(500).json(error as Record<string, any>);
    }
  });

  return router;
};

export default userRoute;
