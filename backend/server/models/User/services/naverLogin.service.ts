import fetch from "node-fetch";
import { URLSearchParams } from "url";

const OAUTH_NAVER_CLIENT_ID = process.env.OAUTH_NAVER_CLIENT_ID;
const OAUTH_NAVER_CLIENT_SECRET = process.env.OAUTH_NAVER_CLIENT_SECRET;
const OAUTH_NAVER_REDIRECT_URI = process.env.OAUTH_NAVER_REDIRECT_URI;

export const getNaverAccessToken = async (code, state) => {
  // 접근 토큰 요청

  const authParams = new URLSearchParams();
  authParams.append("grant_type", "authorization_code");
  authParams.append("client_id", OAUTH_NAVER_CLIENT_ID);
  authParams.append("client_secret", OAUTH_NAVER_CLIENT_SECRET);
  authParams.append("redirect_uri", OAUTH_NAVER_REDIRECT_URI);
  authParams.append("code", code);
  authParams.append("state", state);

  const tokenRes = await fetch(`https://nid.naver.com/oauth2.0/token`, {
    method: "POST",
    body: authParams,
  });

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.accessToken;

  return accessToken;
};

export const getNaverUser = async (accessToken) => {
  const res = await fetch(`https://openapi.naver.com/v1/nid/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  if (!data.response || !data.response.id) {
    throw new Error("Invalid naver access token.");
  }

  const id = data.response.id;
  const email = data.response.email || data.response.id + "@naver";
  const picture = data.response.profile_image;
  const name = data.response.name || "";

  console.log("id", id);
  console.log("email", email);
  console.log("name", name);

  if (!email) {
    const deleteParams = new URLSearchParams();
    deleteParams.append("grant_type", "delete");
    deleteParams.append("client_id", OAUTH_NAVER_CLIENT_ID);
    deleteParams.append("client_secret", OAUTH_NAVER_CLIENT_SECRET);
    deleteParams.append("accessToken", accessToken);
    deleteParams.append("service_provider", "NAVER");

    const deleteRes = await fetch(`https://nid.naver.com/oauth2.0/token`, {
      method: "POST",
      body: deleteParams,
    });
    const deleteData = await deleteRes.json();

    throw new Error("email or name is null");
  }

  return { id, email, picture, name };
};
