import fetch from "node-fetch";
import jwkToPem from "jwk-to-pem";
import jwt from "jsonwebtoken";

const getAppleJWKs = async () => {
  const url = `https://appleid.apple.com/auth/keys`;
  const init = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };
  // express 서버와 프론트의 ajax 통신
  const res = await fetch(url, init);
  const data = await res.json();

  return data;
};

export const getAppleUser = async (accessToken) => {
  const jwks = await getAppleJWKs();

  for (let key of jwks.keys) {
    const pem = jwkToPem(key);
    try {
      const obj = await jwt.verify(accessToken, pem);
      const id = obj.sub;
      const email = obj.email || obj.sub + "@apple";
      // if (!obj.email_verified) {
      //   throw new Error("Email verification is required.");
      // }
      return { id, email, picture: null, name: null };
    } catch (e) {}
  }

  throw new Error("Invalid apple access token.");
};
