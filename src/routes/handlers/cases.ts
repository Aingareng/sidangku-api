import { Router, Request, Response } from "express";
import authMiddleware from "../middleware/authMiddleware";
import casesController from "../../controllers/casesController";
import { CasesPayload } from "../../interface/case";

const casesRoute = () => {
  const router: Router = Router();
  const controller: casesController = new casesController();

  router.post("/", async (req: Request, res: Response) => {
    try {
      const result = await controller.create(req.body as CasesPayload);
      res.status(result.status as number).json(result);
    } catch (error) {
      res.status(500).json(error as Record<string, any>);
    }
  });

  router.get("/", authMiddleware, async (req: Request, res: Response) => {
    try {
      // const result = await controller.get({ ...req.query });
      // res.status(result.status as number).json(result);
    } catch (error) {
      res.status(500).json(error as Record<string, any>);
    }
  });

  return router;
};

export default casesRoute;
