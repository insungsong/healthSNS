import express from "express";
import { ApolloServer } from "apollo-server-express";
import { applyMiddleware } from "graphql-middleware";
import { buildSchemaSync, NonEmptyArray } from "type-graphql";
import { connectDatabase } from "./lib/connectDatabase";
import { parseAuthHeader } from "./lib/parseAuthHeader";

/**
 * Express 서버를 실행합니다.
 *
 * @author Insung song
 */

//일반적인 node server를 생성하는 코드
const expressApp = express();

//resolver를 읽어 오기위한 선언 코드
const resolvers: NonEmptyArray<Function> | NonEmptyArray<string> = [
  __dirname + "/models/**/*.resolver.{ts,js}"
];

//apolloServer에 올린 schema를 정의
const schema = applyMiddleware(
  buildSchemaSync({
    resolvers
  })
);

export interface Context {
  user?: any;
}

const context = async ({ req }): Promise<Partial<Context>> => {
  await connectDatabase();
  const user = await parseAuthHeader(req.headers.authorization);

  return { ...req, user };
};

//ApolloServer를 사용하기 위한 코드
const server = new ApolloServer({
  schema,
  context
});

server.applyMiddleware({ app: expressApp });

export default expressApp;
