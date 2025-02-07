import pool from "./pool";

interface MessageOutput {
  post: string;
  userId: number;
  messageId?: number;
  createdAt?: Date;
  posts?: MessageOutput[];
}

interface MessageResponse {
  messageId?: number;
  status: number;
  message: string;
}

export async function handleCreatePost(post: string, userId: number): Promise<MessageOutput> {
  if (!post || !userId) {
    throw new Error(
      "Invaid input: Post content and user ID must be provided"
    );
  }

  const query = `insert into messages (text, user_id) values ($1, $2) returning message_id as "messageId", text as post, created_at as "createdAt";`;
  const values = [post, userId];
  try {
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error("Failed to create message");
    }

    return result.rows[0];
  } catch (error: unknown) {
    console.error("Error posting message", error);
    throw new Error("Error posting message");
  }
}

export async function handleDeletePost(id: number): Promise<MessageResponse> {
  const query = `delete from messages where message_id = $1 returning message_id`;
  const values = [id];
  try {
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return {
        message: "Post not found",
        status: 404,
      };
    }
    return {
      message: "Post deleted successfully",
      status: 200,
      messageId: result.rows[0].messageid,
    };
  } catch (error: unknown) {
    console.error("Error deleting post", error);
    throw new Error("Error deleting post");
  }
}

export async function handleGetPosts(id: number): Promise<MessageOutput[] | string>{
  const user = await pool.query(
    "select membership from users where user_id = $1",
    [id]
  );
  const isMember = user.rows[0]?.membership;

  const query = isMember
    ? "select messages.message_id, messages.text, messages.created_at, users.username from messages join users on messages.user_id = users.user_id"
    : "select message_id, text from messages";

  try{
    const result = await pool.query(query);
    
    if (result.rowCount === 0) {
      return "No posts found for the user";
    }

    return result.rows as MessageOutput[];
  }catch(error: unknown){
    console.error("Error fetching posts.", error);
    throw new Error("Error fetching posts.");
  }
}

export async function handleGetPostsAdmin(id: number): Promise<MessageOutput[] | string> {
  const user = await pool.query("select admin from users where user_id = $1", [id]);
  const isAdmin = user.rows[0]?.admin;

  const query = "select messages.message_id, messages.text, messages.created_at, users.username from messages join users on messages.user_id = users.user_id";

  try{
    if (isAdmin){
      const result = await pool.query(query);
      return result.rows as MessageOutput[];
    } else {
      return "You don't have admin privileges";
    }
  }catch(error: unknown){
    console.error("Error fetching posts.", error);
    throw new Error("Error fetching posts.");
  }
}

export async function handleGetPersonalPosts(id: number): Promise<MessageOutput[] | string >{
  const query = "select * from messages where user_id = $1 ";
  const values = [id];
  try{
    const result= await pool.query(query, values);

    if (result.rowCount === 0) {
      return "No posts found for the user";
    }

    return result.rows as MessageOutput[];
  }catch(error: unknown){
    console.error("Error fetching posts.", error);
    throw new Error("Error fetching posts.");
  }
}

export async function handleGetPostsByUserId(
  id: number
): Promise<MessageOutput[] | string> {
  try {
    const user = await pool.query(
      "select membership from users where user_id = $1",
      [id]
    );
    const isMember = user.rows[0]?.membership;

    const query = isMember
      ? "select messages.message_id, messages.text, messages.created_at, users.username from messages join users on messages.user_id = users.user_id"
      : "select message_id, text from messages";
    const result = await pool.query(query);

    if (result.rowCount === 0) {
      return "No posts found for the user";
    }

    return result.rows as MessageOutput[];
  } catch (error: unknown) {
    console.error("Error fetching posts", error);
    throw new Error("Error fetching posts");
  }
}
