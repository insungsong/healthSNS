import jwt from "jsonwebtoken";
import { CERT_PUBLIC, CERT_PRIVATE } from "../../../../env.config";
import { TokenObject } from "../objects/Token.object";

const JWT_ISSUER = process.env.JWT_ISSUER || "";

export async function refreshTokenService(refreshToken: string) {
  const expiresIn = 60 * 60 * 2; // 2h
  const user = await jwt.verify(refreshToken, CERT_PUBLIC);
  if (user.sub !== "refreshToken") {
    throw new Error("Invalid token");
  }

  const accessToken = await jwt.sign(
    {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    CERT_PRIVATE,
    {
      algorithm: "ES256",
      subject: "accessToken",
      expiresIn,
      issuer: JWT_ISSUER,
    }
  );

  const tokenObject = new TokenObject();
  tokenObject.token = accessToken;
  tokenObject.accessToken = accessToken;
  tokenObject.refreshToken = undefined;
  tokenObject.expires_in = expiresIn;
  tokenObject.token_type = "Bearer";
  return tokenObject;
}
