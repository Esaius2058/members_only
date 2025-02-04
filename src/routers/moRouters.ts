import { Router } from "express";
import {
  createUser,
  getUserById,
  updateUser,
  loginUser,
  logoutUser,
} from "../controllers/userController";
import {
  createPost,
  getPostsByUserId,
  deletePost,
  loadUserProfile
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
moRouter.get("/dashboard", loadUserProfile);
moRouter.get("/user-profile", (req, res) => {
  res.render("user-profile", {title: "User Profile", user: req.user});
});
moRouter.get("/users/:userId", getUserById);
moRouter.put("/users/update/:userId", updateUser);

//Messages Routes
moRouter.get("/posts/new", (req, res) => {
  res.render("new_post", {title: "New Post"});
});
moRouter.post("/posts/new", createPost);
moRouter.get("/posts/:userId", getPostsByUserId);
moRouter.delete("/posts/delete/:messageId", deletePost);

export default moRouter;
