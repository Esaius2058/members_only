import { Response, Request, NextFunction } from "express";
import {
  handleCreatePost,
  handleDeletePost,
  handleGetPersonalPosts,
  handleGetPosts,
  handleGetPostsByUserId,
} from "../db/messageQueries";
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

export async function deletePost(req: Request, res: Response): Promise<void> {
  const { messageId } = req.params;

  try {
    await handleDeletePost(Number(messageId));
    res
      .status(200)
      .json({ message: "Successfully deleted message", messageId: messageId });
  } catch (error: unknown) {
    console.error("Internal server error", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
