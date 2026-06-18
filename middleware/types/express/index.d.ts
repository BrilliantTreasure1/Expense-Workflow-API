import { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  userId: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
