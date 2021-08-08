import AdminBro from "admin-bro";
import AdminBroExpress from "@admin-bro/express";
import { createConnection } from "typeorm";
import { ClientEntity } from "../../models/Client/entities/Client.entity";
import { Database, Resource } from "@admin-bro/typeorm";
import { UserAuthEntity } from "../../models/UserAuth/entities/UserAuth.entity";
import { ProjectEntity } from "../../models/Project/entities/Project.entity";
import { ProjectApiEntity } from "../../models/ProjectApi/entities/ProjectApi.entity";
import { ProjectAppConfigEntity } from "../../models/ProjectAppConfig/entities/ProjectAppConfig.entity";
import { ProjectRoleEntity } from "../../models/ProjectRole/entities/ProjectRole.entity";
import { ProjectLoginConfigEntity } from "../../models/ProjectLoginConfig/entities/ProjectLoginConfig.entity";
import { ProjectTermEntity } from "../../models/ProjectTermEntity/entities/ProjectTerm.entity";
import { ProjectTokenConfigEntity } from "../../models/ProjectTokenConfig/entities/ProjectTokenConfig.entity";
import { ClientAuthEntity } from "../../models/ClientAuth/entities/ClientAuth.entity";
import { ClientMultiFactorEntity } from "../../models/ClientMultiFactor/entities/ClientMultiFactor.entity";
import { UserMultiFactorEntity } from "../../models/UserMultiFactor/entities/UserMultiFactor.entity";
import { UserEntity } from "../../models/User/entities/User.entity";

AdminBro.registerAdapter({ Database, Resource });

export default async function useAdminBroExpress(app) {
  const connection = await createConnection();

  ClientEntity.useConnection(connection);
  ClientAuthEntity.useConnection(connection);
  ClientMultiFactorEntity.useConnection(connection);
  ProjectEntity.useConnection(connection);
  ProjectApiEntity.useConnection(connection);
  ProjectAppConfigEntity.useConnection(connection);
  ProjectRoleEntity.useConnection(connection);
  ProjectLoginConfigEntity.useConnection(connection);
  ProjectTermEntity.useConnection(connection);
  ProjectTokenConfigEntity.useConnection(connection);
  UserEntity.useConnection(connection);
  UserAuthEntity.useConnection(connection);
  UserMultiFactorEntity.useConnection(connection);

  const clientNavigation = { name: "클라이언트" };
  const projectNavigation = { name: "프로젝트" };
  const userNavigation = { name: "사용자" };

  const adminBro = new AdminBro({
    resources: [
      {
        resource: ClientEntity,
        options: {
          navigation: clientNavigation,
          properties: {
            availableValues: {
              value: "Email",
              label: "test",
            },
          },
        },
      },
      {
        resource: ClientAuthEntity,
        options: { navigation: clientNavigation },
      },
      {
        resource: ClientMultiFactorEntity,
        options: { navigation: clientNavigation },
      },
      {
        resource: ProjectEntity,
        options: { navigation: projectNavigation },
      },
      {
        resource: ProjectApiEntity,
        options: { navigation: projectNavigation },
      },
      {
        resource: ProjectAppConfigEntity,
        options: { navigation: projectNavigation },
      },
      {
        resource: ProjectRoleEntity,
        options: { navigation: projectNavigation },
      },
      {
        resource: ProjectLoginConfigEntity,
        options: { navigation: projectNavigation },
      },
      {
        resource: ProjectTermEntity,
        options: { navigation: projectNavigation },
      },
      {
        resource: ProjectTokenConfigEntity,
        options: { navigation: projectNavigation },
      },
      {
        resource: UserEntity,
        options: { navigation: userNavigation },
      },
      {
        resource: UserAuthEntity,
        options: { navigation: userNavigation },
      },
      {
        resource: UserMultiFactorEntity,
        options: { navigation: userNavigation },
      },
    ],
    locale: {
      language: "ko",
      translations: {
        labels: {
          UserEntity: "클라이언트 관리",
          ClientAuthEntity: "클라이언트 인증수단 설정",
          ClientMultiFactorEntity: "클라이언트 다중인증 설정",
          ProjectEntity: "프로젝트 관리",
          ProjectApiEntity: "프로젝트 API 설정",
          ProjectAppConfigEntity: "프로젝트 앱 설정",
          ProjectRoleEntity: "프로젝트 권한 설정",
          ProjectLoginConfigEntity: "프로젝트 로그인 설정",
          ProjectTermEntity: "프로젝트 약관 설정",
          ProjectTokenConfigEntity: "프로젝트 토큰 설정",
          UserOfClientEntity: "사용자 관리",
          UserAuthEntity: "사용자 인증수단 설정",
          UserMultiFactorEntity: "사용자 다중인증 설정",
        },
      },
    },
    rootPath: "/adminbro",
  });

  const router = AdminBroExpress.buildRouter(adminBro);
  app.use(adminBro.options.rootPath, router);

  //   try {
  //     UserEntity.useConnection(connection);
  //   } catch (e) {
  //     console.log('asdasd', e);
  //   }

  //   const adminBro = new AdminBro({
  //     // databases: [connection],
  //     resources: [
  //       // { resource: UserEntity, options: { parent: { name: 'foobar' } } }
  //       {resource: UserEntity, options: {parent: {name: 'foobar'}}},
  //     ],
  //     rootPath: '/admin',
  //   });

  //@ts-ignore
  //   AdminBroExpress.buildRouter(adminBro);

  // return (
  //   <div>
  //     <h1>hello</h1>
  //   </div>
  // );
}
