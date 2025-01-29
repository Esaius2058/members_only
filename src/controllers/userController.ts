import { Request, Response, NextFunction } from "express";
import {
  handleCreateUser,
  handleGetUserById,
  handleUpdateUser,
} from "../db/userQueries";
import passport from "../db/userQueries";

interface LoginRequestBody {
  username: string;
  password: string;
}

export async function createUser(req: Request, res: Response): Promise<void> {
  const { fullname, username, password } = req.body;
  let membership = false;

  try {
    const user = await handleCreateUser({
      fullname,
      username,
      password,
      membership,
    });
    console.log("New user added", user);
    res.status(201).json({
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
  const { userid } = req.params;

  try {
    const user = await handleGetUserById(Number(userid));
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
  const { fullname, username, password } = req.body;

  try {
    const updatedUser = await handleUpdateUser({
      fullname,
      username,
      password,
    });
    res.status(200).json({
      mesage: "Updated successfully",
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
      return res.status(401).json({ message: info.message });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      res
        .status(200)
        .json({
          message: "Login successful",
          user: { id: user.id, username: user.username},
        });
    });
  })(req, res, next);
}
