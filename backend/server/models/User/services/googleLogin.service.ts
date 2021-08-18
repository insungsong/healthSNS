import fetch from "node-fetch";

export const getGoogleUser = async (accessToken) => {
  console.log("getGoogleUser accessToken ==== ", accessToken);

  const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&accessToken=${accessToken}`;
  const init = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  const res = await fetch(url, init);
  const data = await res.json();

  const id = data.id;
  const email = data.email || data.id + "@google";
  const picture = data.picture;
  const name = data.name;

  if (!id || !email) {
    throw new Error("Invalid google access token.");
  }

  return { id, email, picture, name };
};
