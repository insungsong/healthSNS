import fetch from "node-fetch";

export const getFacebookUser = async (accessToken) => {
  const url = `https://graph.facebook.com/me?fields=id,email,name,picture&accessToken=${accessToken}`;
  const init = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };
  // express 서버와 프론트의 ajax 통신
  const res = await fetch(url, init);
  const data = await res.json(); //객체에서 사진을 가져옴

  const id = data.id;
  const email = data.email || data.id + "@facebook";
  const picture = data.picture.data.url;
  const name = data.name;

  if (!id || !email) {
    throw new Error("Invalid facebook access token.");
  }

  return { id, email, picture, name };
};
