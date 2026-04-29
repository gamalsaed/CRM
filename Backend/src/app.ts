import express, { type NextFunction, Request, Response } from "express";
import { errorController } from "./Controllers/error-controller";
import lead_router from "./routes/leads-routes";

const app = express();

app.use(express.json());

app.use("/api/v1/leads", lead_router);

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("asd");
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl}`,
  });
});

app.use(errorController);

export default app;
