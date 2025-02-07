import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
dotenv.config();

import {
  handleCreateUser,
  handleGetUserById,
  handleUpdateUser,
  handleAddMember,
  CustomUser,
  handleAdminAuthentication,
} from "../db/userQueries";
import passport from "../db/userQueries";

interface LoginRequestBody {
  username: string;
  password: string;
}

export async function createUser(req: Request, res: Response): Promise<void> {
  const { firstname, lastname, username, password } = req.body;
  const fullname = firstname +" "+ lastname;
  let membership = false;

  try {
    const user = await handleCreateUser({
      fullname,
      username,
      password,
      membership,
    });
    console.log("New user added", user);
    res.status(user.status).json({
      message: "User created successfully",
      userId: user.userId,
      userName: user.userName,
    });
  } catch (error: unknown) {
    console.error("Internal server error", error);
    res.status(500).json("Internal server error");
  }
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  const { userId } = req.params;

  try {
    const user = await handleGetUserById(Number(userId));
    res.status(200).json({
      fullname: user.fullname,
      username: user.username,
      membership: user.membership,
    });
  } catch (error: unknown) {
    console.error("Internal server error", error);
    res.status(500).json("Internal server error");
  }
}

export async function updateUser(req: Request, res: Response) {
  const { fullname, username} = req.body;
  const id = req.user?.id;
  const password = req.user?.password;

  try {
    const updatedUser = await handleUpdateUser({
      id,
      fullname,
      username,
      password
    });
    res.status(updatedUser.status).json({
      message: updatedUser.message,
      userName: updatedUser.userName,
      fullName: updatedUser.fullName,
    });
  } catch (error: unknown) {
    console.error("Internal server error", error);
    res.status(500).json("Internal server error");
  }
}

export async function loginUser(
  req: Request<{}, {}, LoginRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> {
  passport.authenticate("local", (err: unknown, user: any, info: any) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.redirect("/users/log-in");
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.redirect("/users/dashboard");
    });
  })(req, res, next);
}

export async function logoutUser(req: Request, res: Response, next: NextFunction): Promise<void>{
  req.logout((error) => {
    if(error){
      return next(error);
    }
    req.session.destroy(() => {
      res.redirect("/");//redirect to login after logout
    });
  });
};

export async function joinClub(req: Request, res: Response): Promise<void> {
  const { passcode } = req.body;
  const userId = req.user?.id;
  console.log(userId);

  const SECRET_PASSCODE = "cats suck";

  if (passcode !== SECRET_PASSCODE) {
    res.status(403).json({ message: "Incorrect passcode!" });
    return;
  }

  try {
    const update = await handleAddMember(Number(userId));
    res.status(update.status).json({ message: update.message });
  } catch (error: unknown) {
    console.error("Internal server error", error);
    res.status(500).json("Internal server error");
  }
}

export async function authenticateAdmin(req: Request, res: Response): Promise<void> {
  const {passcode} = req.body;
  const userId = req.user?.id;

  const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE;

  if (passcode !== ADMIN_PASSCODE){
    res.status(403).json({ message: "Incorrect admin passcode!" });
    return;
  }

  try{
    const update = await handleAdminAuthentication(Number(userId), passcode);
    if(update.status === 200){
      return res.redirect("/users/admin/dashboard");
    }
  } catch (error: unknown){
    console.error("Internal server error", error);
    res.status(500).json("Internal server error");
  }
}