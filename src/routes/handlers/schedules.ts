import { Router, Request, Response } from "express";
import authMiddleware from "../middleware/authMiddleware";
import SchedulesController from "../../controllers/schedulesController";
import { ISchedulesPayload } from "../../interface/sequelizeValidationError";
import SendNoticationService from "../../services/whats-app/SendNoticationService";
import { HttpStatusCode } from "../../types/httpCode";
import setReplacementClerkController, {
  IReplacementClerkPayload,
} from "../../controllers/setReplacementClerkController";
import notificationController from "../../controllers/notificationController";
import { INotificationPayload } from "../../interface/notification";

const schedulesRoute = () => {
  const router: Router = Router();
  const controller: SchedulesController = new SchedulesController();

  router.post("/", async (req: Request, res: Response) => {
    try {
      const result = await controller.create(req.body as ISchedulesPayload);
      res.status(result.status as number).json(result);
    } catch (error) {
      res.status(500).json(error as Record<string, any>);
    }
  });

  router.get("/", async (req: Request, res: Response) => {
    try {
      const result = await controller.get({ ...req.query });
      res.status(result.status as number).json(result);
    } catch (error) {
      res.status(500).json(error as Record<string, any>);
    }
  });
  router.delete("/:id", async (req: Request, res: Response) => {
    try {
      const result = await controller.delete(req.params.id as string);
      res.status(result.status as number).json(result);
    } catch (error) {
      res.status(500).json(error as Record<string, any>);
    }
  });
  router.put("/:id", async (req: Request, res: Response) => {
    try {
      const result = await controller.update(
        req.params.id as string,
        req.body as ISchedulesPayload
      );
      res.status(result.status as number).json(result);
    } catch (error) {
      res.status(500).json(error as Record<string, any>);
    }
  });

  router.post("/send-notification", async (req: Request, res: Response) => {
    try {
      const result = await notificationController.call(
        req.body as INotificationPayload
      );
      res.status(result.status as HttpStatusCode).json(result);
    } catch (error) {
      res.status(500).json(error as Record<string, any>);
    }
  });

  router.post("/set-cleck", async (req: Request, res: Response) => {
    try {
      const result = await setReplacementClerkController.call(
        req.body as IReplacementClerkPayload
      );
      res.status(result.status as number).json(result);
    } catch (error) {
      res.status(500).json(error as Record<string, any>);
    }
  });

  return router;
};

export default schedulesRoute;
