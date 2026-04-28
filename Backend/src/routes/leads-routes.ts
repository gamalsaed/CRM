import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

const lead_router = express.Router();

lead_router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: "success",
    data: {
      leads: ["lead1", "lead2"],
    },
  });
});

export default lead_router;
