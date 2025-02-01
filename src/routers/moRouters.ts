import { Router } from "express";
import {
  createUser,
  getUserById,
  updateUser,
  loginUser,
} from "../controllers/userController";
import {
  createPost,
  getPostsByUserId,
  deletePost,
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
moRouter.get("/users/:userId", getUserById);
moRouter.put("/users/update/:userId", updateUser);

//Messages Routes
moRouter.post("/messages/post", createPost);
moRouter.get("/messages/:userId", getPostsByUserId);
moRouter.delete("/messages/delete/:messageId", deletePost);

export default moRouter;
