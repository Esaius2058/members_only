import { CustomUser, User } from "../db/userQueries";

declare global {
  namespace Express {
    interface User extends CustomUser{}
  }
}
