import { Router } from "express";
import {
  createUser,
  getUserById,
  updateUser,
  loginUser,
  logoutUser,
  joinClub,
  authenticateAdmin,
} from "../controllers/userController";
import {
  createPost,
  getPostsByUserId,
  deletePost,
  loadUserProfile,
  loadDashboard,
  loadAdminDashboard
} from "../controllers/messageController";

const moRouter = Router();

moRouter.get("/", (req, res) => {
    res.render("welcome");
});
//Users Routes
moRouter.get("/users/register", (req, res) => {
  res.render("sign-up");
});
moRouter.post("/users/register", createUser);
moRouter.get("/users/log-in", (req, res) => {
    res.render("log-in");
});
moRouter.post("/users/log-in", loginUser);
moRouter.post("/users/log-out", logoutUser);
moRouter.get("/users/dashboard", loadDashboard);
moRouter.get("/user-profile", loadUserProfile);
moRouter.get("/users/join-club", (req, res) => {
  res.render("join-club");
});
moRouter.get("/users/admin-auth", (req, res) => {
  res.render("admin-auth", {title: "Admin Authentication"});
});
moRouter.post("/users/admin-auth", authenticateAdmin);
moRouter.get("/users/admin/dashboard", loadAdminDashboard);
moRouter.get("/users/:userId", getUserById);
moRouter.post("/users/join-club", joinClub);
moRouter.get("/users/profile/update", (req, res) => {
  res.render("update", {title: "Profile Update",user: {...req.user}});
});
moRouter.post("/users/profile/update", updateUser);

//Messages Routes
moRouter.get("/posts/new", (req, res) => {
  res.render("new-post", {title: "New Post"});
});
moRouter.post("/posts/new", createPost);
moRouter.get("/posts/:userId", getPostsByUserId);
moRouter.post("/posts/delete", deletePost);

export default moRouter;
