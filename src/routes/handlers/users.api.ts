import { Router, Request, Response } from "express";
import UserController from "../../controllers/userController";

const userRoute = () => {
  const router: Router = Router();
  const controller: UserController = new UserController();

  router.get("/", async (req: Request, res: Response) => {
    try {
      const result = await controller.get({ ...req.body });

      res.status(result.status as number).json(result);
    } catch (error: unknown) {
      console.log(error);
      // throw Error(error as string);
    }
  });

  return router;
};

export default userRoute;
