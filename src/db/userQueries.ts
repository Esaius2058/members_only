import pool from "./pool";
import bcrypt from "bcryptjs";
import passport, { use } from "passport";
import { Strategy as LocalStrategy } from "passport-local";

export interface CustomUser {
  id?: number;
  fullname?: string;
  username: string;
  password: string;
  membership?: boolean;
  passcode?: string;
}

interface UserResponse {
  message: string;
  status: number;
  userId: number;
  userName: string;
  fullName?: string;
}

export async function handleCreateUser({
  fullname,
  username,
  password,
  membership = false,
}: CustomUser): Promise<UserResponse> {
  if (!fullname || !username || !password) {
    throw new Error("Invalid input: All fields must be provided");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `insert into users (fullname, username, password, membership) values ($1, $2, $3, $4) returning user_id, username, fullname`;
  const values = [fullname, username, hashedPassword, membership];

  try {
    const result = await pool.query(query, values);
    return {
      message: "User created successfullly",
      status: 201,
      userId: result.rows[0].user_id,
      userName: result.rows[0].username
    };
  } catch (error: unknown) {
    console.error("Could not create user", error);
    throw new Error("Could not create user");
  }
}

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const result = await pool.query(
        "select * from users where username = $1",
        [username]
      );
      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password);

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (!match) {
        return done(null, false, { message: "Incorrrect password" });
      }
      return done(null, user);
    } catch (error: unknown) {
      return done(error);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const result = await pool.query("select * from users where user_id = $1", [id]);
    const user = result.rows[0];

    if (!user) return done(null, false);
    done(null, {
      id: user.user_id,
      username: user.username,
      fullname: user.fullname,
      membership: user.membership,
      password: user.password
    });
  } catch (error: unknown) {
    done(error);
  }
});

export async function handleUpdateUser({
  fullname,
  username,
  password,
}: CustomUser): Promise<UserResponse> {
  if (!fullname || !username || !password) {
    throw new Error("Invalid input: All fields must be provided");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `update users set fullname = $1, username = $2, password = $3 where username = $2 returning user_id`;
  const values = [fullname, username, hashedPassword];

  try {
    const result = await pool.query(query, values);
    return {
      message: "Updated successfully",
      status: 200,
      userId: result.rows[0].user_id,
      userName: result.rows[0].username,
      fullName: result.rows[0].fullname
    };
  } catch (error) {
    console.error("Error updating user");
    throw new Error("Error updating user");
  }
}

export async function handleGetUserById(id: number): Promise<CustomUser> {
  try {
    const result = await pool.query("select * from users where user_id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    return result.rows[0] as CustomUser;
  } catch (error: unknown) {
    console.error("User not found");
    throw new Error("User not found");
  }
}

export async function handleAddMember({id}: CustomUser): Promise<UserResponse>{ 
  try{
    const result = await pool.query("update users set membership = true where user_id = $1 returning user_id, username", [id]);
    
    if (result.rowCount === 0) {
      throw new Error("User not found or already a member");
    }

    return {
      message: "Welcome to the club!!",
      status: 200,
      userId: result.rows[0].id,
      userName: result.rows[0].username
    };
  }catch(error: unknown){
    console.error("Error updating membership", error);
    throw new Error("Error updating membership");
  }
  
}

export default passport;
