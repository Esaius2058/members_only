import { Response, Request, NextFunction } from "express";
import {
  handleCreatePost,
  handleDeletePost,
  handleGetPersonalPosts,
  handleGetPosts,
  handleGetPostsByUserId,
  handleGetPostsAdmin
} from "../db/messageQueries";
import { handleGetUsersAdmin } from "../db/userQueries";
import pool from "../db/pool";

interface MessageOutput {
  message: string;
  userId: number;
  messageId?: number;
  createdAt?: Date;
}

export async function createPost(req: Request, res: Response): Promise<void> {
  const { post } = req.body;
  const user = req.user; 
  const userId = user?.id;

  try {
    const newPost = await handleCreatePost(post, Number(userId));
    res.status(201).json({
      post: newPost.post,
      messageId: newPost.messageId,
      createdAt: newPost.createdAt,
    });
  } catch (error: unknown) {
    console.error("Internal server error", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPostsByUserId(
  req: Request,
  res: Response
): Promise<void> {
  const { userId } = req.params;

  try {
    const userPosts = await handleGetPostsByUserId(Number(userId));

    if (!userPosts.length) {
      res.status(404).json({ message: "No posts found for this user" });
    }

    res.status(200).json({
      message: "User's posts retreived successfully",
      userId: userId,
      posts: userPosts,
    });
  } catch (error: unknown) {
    console.error("Internal server error", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function loadDashboard(req: Request, res: Response): Promise<void>{
  if (!req.user) {
    return res.redirect("/users/log-in");
  }
  
  try{
    const userId = req.user.id;
    const allPosts = await handleGetPosts(Number(userId));
    res.render("dashboard", { user: { ...req.user, AllPosts: allPosts } });
  }catch(error: unknown){
    console.error("Error fetching posts", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function loadUserProfile(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    return res.redirect("/users/log-in");
  }

  try {
    const userPosts = await handleGetPersonalPosts(Number(req.user.id));
    res.render("user-profile", {title: "User Profile", user: { ...req.user, posts: userPosts } });
  } catch (error: unknown) {
    console.error("Error fetching user posts:", error);
    res.status(500).send("Internal server error");
  }
}

export async function loadAdminDashboard(req: Request, res: Response) :Promise<void> {
  if (!req.user) {
    return res.redirect("/users/log-in");
  }
  const userId = req.user.id;

  try{
    const allPosts = await handleGetPostsAdmin(Number(userId));
    const allUsers = await handleGetUsersAdmin(Number(userId));
    return res.render("admin-dashboard", {title: "Admin Dashboard", Users: {posts: allPosts, users: allUsers}});
  }catch (error: unknown){
    console.error("Error fetching users and posts", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deletePost(req: Request, res: Response): Promise<void> {
  const messageId = req.query.messageId;
  console.log("MessageId:", messageId);

  try {
    const result = await handleDeletePost(Number(messageId));
    res
      .status(result.status)
      .json({ message: result.message, messageId: result.messageId });
  } catch (error: unknown) {
    console.error("Internal server error", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
