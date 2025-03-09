import { Router, Request, Response } from "express";

export default (prefix: string = "/", handler: Router): Router => {
  const router: Router = Router();

  router.use(prefix, handler);

  return router;
};
