import pool from "./pool";

interface MessageOutput {
  message: string;
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

export async function handleCreatePost({
  message,
  userId,
}: MessageOutput): Promise<MessageOutput> {
  if (!message || !userId) {
    throw new Error(
      "Invaid input: Message content and user ID must be provided"
    );
  }

  const query = `insert into messages (text, user_id) values ($1, $2) returning message_id as messageId, content as message, created_at as createdAt;`;
  const values = [message, userId];
  try {
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error("Failed to create message");
    }

    return result.rows[0];
  } catch (error: unknown) {
    console.error("Error posting message");
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

export async function handleGetPostsByUserId(
  id: number
): Promise<MessageOutput[]> {
  try {
    const user = await pool.query(
      "select membership from users where user_id = $1",
      [id]
    );
    const isMember = user.rows[0]?.membership;

    const query = isMember
      ? "select messages.messageid, messages.text, users.username from messages join users on messages.user_id = users.user_id"
      : "select message_id, text from messages";
    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new Error("No posts found for the user");
    }

    return result.rows as MessageOutput[];
  } catch (error: unknown) {
    console.error("Error fetching posts", error);
    throw new Error("Error fetching posts");
  }
}
