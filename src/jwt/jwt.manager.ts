import { CustomRequest } from "./config";

export default class JwtManager {
  static getTokenFromRequest(req: any) {
    const request = req as CustomRequest;
    // if (!request.token) return null;
    if (!request.token) throw new Error("Missing token");
    
    return request.token;
  }
}