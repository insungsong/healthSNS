import jwt from "jsonwebtoken";
import { CERT_PUBLIC } from "../../env.config";

export const parseAuthHeader = async (authHeader = "") => {
  try {
    //i = 대소문자 구분없이
    const token = authHeader.replace(/Bearer /i, "");
    const jwtObj = await jwt.verify(token, CERT_PUBLIC);

    if (jwtObj.sub === "access_token") return jwtObj;
  } catch (e) {
    console.log("parseAuthHeader Error: ", e);
  }
};
