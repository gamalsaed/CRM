import express from "express";
import {
  getAllUsers,
  getUser,
  deleteUser,
  getMyInfo,
  updateUser,
  updatePassword,
} from "../Controllers/user-controller";
import { restrictTo } from "../middlewares/authMiddleware";
const user_router = express.Router();

user_router.get("/my-info", getMyInfo);
user_router.patch("/update-user-role", restrictTo("admin"), updateUser);
user_router.patch("/update-user", updateUser);
user_router.patch("/change-password", updatePassword);

user_router
  .route("/:userId")
  .get(restrictTo("admin", "team leader"), getUser)
  .delete(restrictTo("admin"), deleteUser);

user_router.get("/", restrictTo("admin"), getAllUsers);

export default user_router;
