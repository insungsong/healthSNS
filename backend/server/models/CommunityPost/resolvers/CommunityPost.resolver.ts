import { Context } from "server/express";
import { InterestEntity } from "../../Interest/entities/Interest.entity";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { CommunityPostEntity } from "../entities/CommunityPost.entity";
import { PostCreateInput } from "../inputs/PostCreateInput.input";
import { PostCreateTypeWhereInput } from "../inputs/PostCreateTypeWhere.input";
import {
  PostAndInterestMergeObject,
  PostCategoryObect,
  PostDetailObject,
  PostObject,
} from "../objects/Post.object";
import { PostWhereInput } from "../inputs/PostWhere.input";
import { PostUpdateWhereInput } from "../inputs/PostUpdateWhere.input";
import { PostUpdateDataInput } from "../inputs/PostUpdateData.input";
import { createQueryBuilder, getConnection } from "typeorm";
import { PostsWhereInput } from "../inputs/PostsWhere.input";
import { CommunityMemberEntity } from "../../CommunityMember/entities/CommunityMember.entity";
import { PostDeleteWhereInput } from "../inputs/PostDeleteWhere.input";
import { PostCategoryCreateInput } from "../inputs/PostCategoryCreate.input";
import { UserEntity } from "../../User/entities/User.entity";
import { SearchInformationPostListWhereInput } from "../inputs/SearchPostListWhere.input";
import { ManagedInterestEntity } from "../../ManagedInterest/entities/ManagedInterest.entity";

enum PostCreateType {
  COMMUNITY = "community",
  ALL = "all",
}

enum Type {
  INFORMATION = "information",
  COMMUNITY = "community",
  USER = "user",
}

@Resolver()
export class CommunityPostResolver {
  @Query(() => [PostObject])
  async posts(@Ctx() ctx: Context, @Arg("where") where: PostsWhereInput) {
    try {
      console.log("ctx: ", ctx.user);
      const mrloginId = ctx.user.userId;

      console.log("where.blockUserList: ", where.blockUserList);

      //mrlogin의 나의 mrLoginToken안의 blockUser:[]안에 들어있는 userId는 게시물과 게시물의 댓글에 작성한 코드가 나에게 보여지면 안된다.
      //TO DO LIST : 지금은, fakeBlockUser 변수안에 있는 데이터를 추후 mrloginToken - blockUser로 대체시켜야합니다.
      const blockUserList = where.blockUserList || [];

      console.log("blockUserListblockUserListblockUserList: ", blockUserList);

      let postsQueryBuilder = CommunityPostEntity.createQueryBuilder(
        "communityPost"
      )
        .leftJoinAndSelect("communityPost.community", "community")
        .leftJoinAndSelect("communityPost.comment", "comment")
        .leftJoinAndSelect("communityPost.user", "mrloginUser")
        .leftJoinAndSelect("community.communityMember", "communityMember")
        .leftJoinAndSelect("communityMember.user", "user")
        .leftJoinAndSelect("communityPost.interest", "interest")
        .where("communityPost.isVisble = true");

      if (where.interest) {
        // Interest
        // 관심분야 클릭시

        postsQueryBuilder = postsQueryBuilder.andWhere(
          "interest.title = :title",
          {
            title: where.interest,
          }
        );
      }

      if (where.communityId) {
        // Community를 눌러서 커뮤니티 게시판으로 들어갔을 때
        postsQueryBuilder = postsQueryBuilder
          .andWhere("community.id = :communityId", {
            communityId: where.communityId,
          })
          .andWhere("user.mrloginId = :mrloginId", { mrloginId })
          .andWhere("community.isClosed = false");
      } else {
        //     const posts = await manager.createQueryBuilder(Post, "post")
        // .where("post.authorId IN (:...authors)", { authors: [3, 7, 9] })
        // .orderBy("post.createDate")
        // .getMany();
        // 메인 홈
        postsQueryBuilder = postsQueryBuilder.andWhere(
          "((communityPost.disclosureRange = :disclosureRange) OR (user.mrloginId = :mrloginId AND communityMember.isApprove = true))",
          {
            mrloginId,
            disclosureRange: PostCreateType.ALL,
          }
        );
      }

      if (!!blockUserList && blockUserList.length > 0) {
        const posts = await postsQueryBuilder
          .andWhere("mrloginUser.mrloginId NOT IN (:...blockUserList)", {
            blockUserList,
          })
          .orderBy("communityPost.createdDate", "DESC")
          .getMany();

        console.log("🤢 posts", posts);
        return posts;
      } else {
        const posts = await postsQueryBuilder
          .orderBy("communityPost.createdDate", "DESC")
          .getMany();
        console.log("posts", posts);
        return posts;
      }
    } catch (e) {
      console.log("posts Error: ", e);
      return null;
    }
  }
  @Query(() => PostAndInterestMergeObject)
  async post(@Arg("where") where: PostWhereInput) {
    try {
      const currentCommunityPost = await CommunityPostEntity.createQueryBuilder(
        "communityPost"
      )
        .leftJoinAndSelect("communityPost.community", "community")
        .leftJoinAndSelect("communityPost.interest", "interest")
        .leftJoinAndSelect("communityPost.user", "user")
        .where("communityPost.id = :id", { id: where.postId })
        .getOne();

      console.log("currentCommunityPost: ", currentCommunityPost);

      let bucketInterestList = [];

      currentCommunityPost?.interest?.map((interest) => {
        bucketInterestList.push(interest.title);
      });

      console.log("bucketInterestList: ", bucketInterestList);

      // let mergeData = { communityPost: currentCommunityPost, user: userInfo };

      // console.log("mergeData: ", mergeData);
      // return mergeData;

      return {
        postObject: currentCommunityPost,
        interest: bucketInterestList,
      };
    } catch (e) {
      console.log("post Error: ", e);
    }
  }

  @Query(() => [PostCategoryObect])
  //게시글을 작성할때 전체공개, 내가 가입한 커뮤니티1,내가 가입한 커뮤니티2....와 같은 정보가 나와야한다
  async postCategory(@Ctx() ctx: Context) {
    try {
      const mrloginId = ctx.user.userId;

      //1.전체공개는 그냥 style상에서 보여주면 되는정보인것이고, 내가 가입한 커뮤니티 정보만 보여지면 됨
      const myCommunityCategory = await CommunityMemberEntity.createQueryBuilder(
        "communityMember"
      )
        .leftJoinAndSelect("communityMember.community", "community")
        .leftJoinAndSelect("communityMember.user", "user")
        .where("user.mrloginId = :mrloginId", { mrloginId })
        .andWhere("communityMember.isApprove = true")
        .andWhere("community.isClosed = false")
        .getMany();

      let filterMyCommunityCategoryArr = [];
      myCommunityCategory.map((item, index) => {
        filterMyCommunityCategoryArr.push({ community: item.community });
      });

      console.log(
        "filterMyCommunityCategoryArr: ",
        filterMyCommunityCategoryArr
      );

      return filterMyCommunityCategoryArr;
    } catch (e) {
      console.log("postsCategory Error: ", e);
      return null;
    }
  }

  @Query(() => [PostObject])
  //정보 공유 버튼을 클릭했을때 나오는 쿼리
  async searchInformationPostList(
    @Ctx() ctx: Context,
    @Arg("where") where: SearchInformationPostListWhereInput
  ) {
    try {
      const mrloginId = ctx.user.userId;

      const term = where.term;

      //TO DO LIST: 해당 부분은 mrlogin UserToken안에 blockUser Id이다.
      const blockUser = [3];

      const queryProcess = CommunityPostEntity.createQueryBuilder(
        "communityPost"
      )
        .leftJoinAndSelect("communityPost.community", "community")
        .leftJoinAndSelect("communityPost.comment", "comment")
        .leftJoinAndSelect("communityPost.user", "mrloginUser")
        .leftJoinAndSelect("community.communityMember", "communityMember")
        .leftJoinAndSelect("communityMember.user", "user")
        .leftJoinAndSelect("communityPost.interest", "interest");

      //여기서부터
      // .leftJoinAndSelect('communityPost.user', 'user');
      // .leftJoinAndSelect('communityPost.community', 'community')
      // .where('community.isClosed = false');

      //정보 공유 게시물
      const informationPosts = await queryProcess
        .where("communityPost.isVisble = true")
        .andWhere(
          "((communityPost.disclosureRange = 'all') OR (communityPost.disclosureRange = 'community' AND user.mrloginId = :mrloginId))",
          {
            mrloginId,
          }
        )
        // .andWhere('user.mrloginId = :mrloginId', {mrloginId})

        .andWhere("communityPost.content ILIKE :content", {
          content: `%${term}%`,
        })
        .orderBy("communityPost.createdDate", "DESC")
        .getMany();
      console.log("입력된 검색어: ", term);
      console.log("informationPosts: ", informationPosts);

      let informationStackPostsArr = [];

      const FilterProcess = informationPosts.map((post) => {
        blockUser.map((blockUserId) => {
          if (post.user.mrloginId === blockUserId) {
          } else {
            informationStackPostsArr.push(post);
          }
        });
      });

      Promise.all(FilterProcess);

      return informationPosts;
    } catch (e) {
      console.log("search Error: ", e);
      return null;
    }
  }

  @Mutation(() => Boolean)
  //input으로 들어오는 type에 따라서 내가 가입한 커뮤니티에도 글쓰기를 할 수 있어야하고, 전체공개 글을 쓸 수도 있다.
  async createPost(
    @Ctx() ctx: Context,
    @Arg("data") data: PostCreateInput,
    @Arg("where") where: PostCreateTypeWhereInput
  ) {
    try {
      const type = where.type;

      const mrloginId = ctx.user.userId;

      const currentCommunityPost = await CommunityPostEntity.create({
        user: mrloginId,
        content: data.content,
        photo: data.photo,
        link: data.link,
        disclosureRange: type,
        community: {
          id: where.communityId,
        },
      }).save();

      //들어온 interest[]값이 InterestEntity에 없는 row인지 확인하고 없다면, 추가해야한다.
      const interestArr = data.interest;

      //rn으로부터 온 interest List들을 하나씩 확인하고 추가및 연결한다.
      const interestProcess = interestArr.map(async (interest, index) => {
        console.log("interest: ", interest);

        //managedInterest에 있는 interestList들이 interestEntity에도 있어야함 즉 1:1관계가 되어져야함
        const isTitle = await InterestEntity.createQueryBuilder("interest")
          .where("interest.title = :title", { title: interest })
          .getOne();

        if (isTitle) {
          await getConnection()
            .createQueryBuilder()
            .relation(InterestEntity, "communityPost")
            .of(isTitle)
            .add(currentCommunityPost.id);
        } else {
          //communityPost로 작성되면서 title이 해당 if문으로
          await InterestEntity.create({
            title: interest,
            communityPost: [
              {
                id: currentCommunityPost.id,
              },
            ],
          }).save();
        }
      });

      await Promise.all(interestProcess);

      return true;
    } catch (e) {
      console.log("createCommunityPost Error: ", e);
      return false;
    }
  }

  @Mutation(() => Boolean)
  //게시글 수정하는 mutation문입니다. 해당 부분에서 카테고리 변경은 불가능
  async updatePost(
    @Ctx() ctx: Context,
    @Arg("where") where: PostUpdateWhereInput,
    @Arg("data") data: PostUpdateDataInput
  ) {
    try {
      const mrloginId = ctx.user.userId;
      console.log("mrloginId: ", mrloginId);
      //1.따라서 기존에 Post에 연결되어있던 interest Relation관계를 싹 지우고
      const postId = where?.communityPostId;

      const interestArr = data?.interest;

      const isWriter = await CommunityPostEntity.createQueryBuilder(
        "communityPost"
      )
        .where("communityPost.id = :id", { id: postId })
        .andWhere("communityPost.user = :user", { user: mrloginId })
        .getOne();

      console.log("isWriter: ", isWriter);

      if (isWriter) {
        //1. 기존의 interest값을 다 지운다.
        await getConnection()
          .createQueryBuilder()
          .delete()
          .from("post_interest")
          .where("communityPostEntityId = :communityPostEntityId", {
            communityPostEntityId: postId,
          })
          .execute();

        //2. 새로 들어온 interest 값을 다 추가한다.
        interestArr?.map(async (interest) => {
          const isTitle = await InterestEntity.createQueryBuilder("interest")
            .where("interest.title = :title", { title: interest })
            .getOne();

          if (isTitle) {
            await getConnection()
              .createQueryBuilder()
              .relation(InterestEntity, "communityPost")
              .of(isTitle)
              .add(postId);
          } else {
            //communityPost로 작성되면서 title이 해당 if문으로
            await InterestEntity.create({
              title: interest,
              communityPost: [
                {
                  id: postId,
                },
              ],
            }).save();
          }
        });
        //2. 그외에 content와 같은 업데이트를 진행 할 수 있게 함
        await createQueryBuilder()
          .update(CommunityPostEntity)
          .set({
            content: data.content,
            photo: data.photo,
            link: data.link,
          })
          .where("id = :id", { id: postId })
          .execute();
      }

      return true;
    } catch (e) {
      console.log("updatePost Error: ", e);
      return false;
    }
  }

  @Mutation(() => Boolean)
  //커뮤니티와 연결된 포스트가 아닌 일반 정보공유 게시물을 지울떄 쓰는 뮤테이션
  async deletePost() {
    try {
    } catch (e) {
      console.log("deletePost Error: ", e);
    }
  }

  @Mutation(() => Boolean)
  //게시글 작성자 || 게시글 매니저 || 게시글 관리자가 해당 게시글을 삭제할 수 있어야합니다.
  async deleteCommunityPost(
    @Ctx() ctx: Context,
    @Arg("where") where: PostDeleteWhereInput
  ) {
    try {
      const type = where.type;

      const mrloginId = ctx.user.userId;

      const queryProcess = CommunityPostEntity.createQueryBuilder(
        "communityPost"
      )
        .leftJoinAndSelect("communityPost.community", "community")
        .leftJoinAndSelect("community.communityMember", "communityMember")
        .leftJoinAndSelect("communityMember.user", "user");

      if (type === "community") {
        const isWriter = await queryProcess
          .where("communityPost.id = :id", { id: where.communityPostId })
          .andWhere("communityPost.user = :user", { user: mrloginId })
          .getOne();

        //해당 게시글의 소유자가 user가 맞는지 확인한다.
        const isRankInfo = await queryProcess
          .where("communityPost.id = :id", { id: where.communityPostId })
          .andWhere("user.mrloginId = :mrloginId", { mrloginId })
          .getOne();

        const rank = isRankInfo.community.communityMember[0].rank;

        if (isWriter || rank === "master" || rank === "manager") {
          // 게시글의 작성자가 user가 맞다면 삭제
          await getConnection()
            .createQueryBuilder()
            .delete()
            .from(CommunityPostEntity)
            .where("id = :id", { id: where.communityPostId })
            .execute();
        }
      } else {
        await getConnection()
          .createQueryBuilder()
          .delete()
          .from(CommunityPostEntity)
          .where("id = :id", { id: where.communityPostId })
          .execute();
      }

      return true;
    } catch (e) {
      console.log("deletePost Error:", e);
      return false;
    }
  }
}
