import { Response, Request, NextFunction } from "express";
import { handleCreatePost, handleDeletePost, handleGetPostsByUserId } from "../db/messageQueries";

interface MessageOutput{
	message: string;
	userId: number;
	messageId?: number;
	createdAt?: Date;
}

export async function createPost(req: Request, res: Response): Promise<void>{
	const {message, userId} = req.body;

	try{
		const post = await handleCreatePost({message, userId});
		res.status(201).json({message: post.message, userId: post.userId, createdAt: post.createdAt});
	}catch(error: unknown){
		console.error("Internal server error", error);
    res.status(500).json({message: "Internal server error"});
	}
}

export async function getPostsByUserId(req: Request, res: Response):Promise<void> {
	const {userId} = req.params;

	try{
		const userPosts = await handleGetPostsByUserId(Number(userId));

		if (!userPosts.length) {
      	res.status(404).json({ message: "No messages found for this user" });
    }

		res.status(200).json({message: "User's posts retreived successfully", userId, posts: userPosts});
	}catch(error: unknown){
		console.error("Internal server error", error);
    res.status(500).json({message: "Internal server error"});
	}
}

export async function deletePost(req: Request, res: Response): Promise<void>{
	const {messageId} = req.params;

	try{
		await handleDeletePost(Number(messageId));
		res.status(200).json({message: "Successfully deleted message", messageId: messageId});
	}catch(error: unknown){
		console.error("Internal server error", error);
    res.status(500).json({message: "Internal server error"});
	}
}