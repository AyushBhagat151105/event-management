import express from "express";
import {
  getUserProfile,
  login,
  logout,
  register,
  resetPassword,
  updatePassword,
  updateUserProfile,
} from "@/controllers/auth.controller";
import { isAuthenticated } from "@/middlewares/isAuthenticated";

const authRoute = express.Router();

authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.post("/logout", isAuthenticated, logout);
authRoute.put("/update-profile", isAuthenticated, updateUserProfile);
authRoute.get("/me", isAuthenticated, getUserProfile);
authRoute.post("/reset-password", isAuthenticated, resetPassword);
authRoute.post("/reset-password/:token", isAuthenticated, updatePassword);

export default authRoute;
