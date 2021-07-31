import { createConnection, getConnectionManager } from "typeorm";

//데이터베이스와 연결하기위해 사용하는 함수입니다.
export const connectDatabase = async () => {
  try {
    if (getConnectionManager().get().isConnected) {
      return;
    }
  } catch (e) {
    console.log("connectDatabase Error: ", e);
  }

  await createConnection();
};
