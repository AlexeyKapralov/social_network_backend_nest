import { Post, PostDocument, PostModelType } from '../domain/posts.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PostsViewDto } from '../api/dto/output/extended-likes-info-view.dto';
import { Paginator } from '../../../common/dto/paginator.dto';
import { QueryDtoBase } from '../../../common/dto/query.dto';
import { User, UserModelType } from '../../users/domain/user.entity';
import { LikeStatus } from '../../likes/api/dto/output/likes-view.dto';
import { Injectable } from '@nestjs/common';
import { LikeQueryRepository } from '../../likes/repository/like-query.repository';

@Injectable()
export class PostsQueryRepository {
    constructor(
        @InjectModel(Post.name) private postModel: PostModelType,
        @InjectModel(User.name) private userModel: UserModelType,
        private readonly likeQueryRepository: LikeQueryRepository,
    ) {
    }

    async findPosts(query: QueryDtoBase, userId: string = '') {
        const countPosts = await this.postModel.find({ isDeleted: false }).countDocuments();

        const posts = await this.postModel.aggregate([
                {
                    $addFields: {
                        _postIdString: { $toString: '$_id' },
                    },
                },
                {
                    $match: {
                        isDeleted: false,
                    },
                },
                {
                    $lookup: {
                        from: 'likes',
                        localField: '_postIdString',
                        foreignField: 'parentId',
                        pipeline: [
                            { $match: { userId: userId } },
                            { $project: { _id: 0, likeStatus: 1 } },
                        ],
                        as: 'likes',
                    },
                },
                { $sort: { [query.sortBy]: query.sortDirection as 1 | -1 } },
                { $skip: (query.pageNumber - 1) * query.pageSize },
                { $limit: query.pageSize },
            ],
        ).exec();

        let mappedPosts: PostsViewDto[] = [];
        await Promise.all(
            posts.map(async (post: PostDocument & { likes: { likeStatus: LikeStatus }[] }) => {
                    let likeStatus: LikeStatus = LikeStatus.None;
                    if (post.likes.length !== 0) {
                        likeStatus = post.likes[0].likeStatus;
                    }
                    const newestLikes = await this.likeQueryRepository.getNewestLikes(post._id.toString(), 3);

                    mappedPosts.push({
                        id: post._id.toString(),
                        title: post.title,
                        shortDescription: post.shortDescription,
                        content: post.content,
                        blogId: post.blogId,
                        blogName: post.blogName,
                        createdAt: post.createdAt,
                        extendedLikesInfo: {
                            likesCount: post.likesCount,
                            dislikesCount: post.dislikesCount,
                            myStatus: likeStatus,
                            newestLikes: newestLikes,
                        },
                    });
                },
            ),
        );

        const postsWithPaginate: Paginator<PostsViewDto> = {
            pagesCount: Math.ceil(countPosts / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount: countPosts,
            items: mappedPosts,
        };

        return postsWithPaginate;
    }

    async findPostsForBlog(query: QueryDtoBase, blogId: string, userId: string = '') {

        const countPosts = await this.postModel.find({ blogId: blogId, isDeleted: false }).countDocuments();
        // const posts: PostDocument[] = await this.postModel.aggregate([
        //     {
        //         $match: {
        //             blogId: blogId,
        //             isDeleted: false,
        //         },
        //     },
        //     { $sort: { [query.sortBy]: query.sortDirection as 1 | -1 } },
        //     { $skip: (query.pageNumber - 1) * query.pageSize },
        //     { $limit: query.pageSize },
        // ]).exec();

        const posts = await this.postModel.aggregate([
                {
                    $addFields: {
                        _postIdString: { $toString: '$_id' },
                    },
                },
                {
                    $match: {
                        blogId: blogId,
                        isDeleted: false,
                    },
                },
                {
                    $lookup: {
                        from: 'likes',
                        localField: '_postIdString',
                        foreignField: 'parentId',
                        pipeline: [
                            { $match: { userId: userId } },
                            { $project: { _id: 0, likeStatus: 1 } },
                        ],
                        as: 'likes',
                    },
                },
                { $sort: { [query.sortBy]: query.sortDirection as 1 | -1 } },
                { $skip: (query.pageNumber - 1) * query.pageSize },
                { $limit: query.pageSize },
            ],
        ).exec();

        let mappedPosts: PostsViewDto[] = [];
        posts.map((post: PostDocument & { likes: { likeStatus: LikeStatus }[] }) => {
                let likeStatus: LikeStatus = LikeStatus.None;
                if (post.likes.length !== 0) {
                    likeStatus = post.likes[0].likeStatus;
                }
                mappedPosts.push({
                    id: post._id.toString(),
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: post.blogName,
                    createdAt: post.createdAt,
                    extendedLikesInfo: {
                        likesCount: post.likesCount,
                        dislikesCount: post.dislikesCount,
                        myStatus: post.likes[0].likeStatus,
                        newestLikes: [],
                    },
                });
            },
        );

        const postsWithPaginate: Paginator<PostsViewDto> = {
            pagesCount: Math.ceil(countPosts / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount: countPosts,
            items: mappedPosts,
        };

        return postsWithPaginate;
    }

    async findPost(postId: string, userId: string = ''): Promise<PostsViewDto> {

        const posts = await this.postModel.aggregate([
                {
                    $addFields: {
                        _postIdString: { $toString: '$_id' },
                    },
                },
                {
                    $match: { _postIdString: postId },
                },
                {
                    $lookup: {
                        from: 'likes',
                        localField: '_postIdString',
                        foreignField: 'parentId',
                        pipeline: [
                            { $match: { userId: userId } },
                            { $project: { _id: 0, likeStatus: 1 } },
                        ],
                        as: 'likes',
                    },
                },
            ],
        ).exec();
        if (posts.length === 0) {
            return null;
        }

        //todo нужно добавить поиск настоящих лайков со временем

        // const newestLikes = this.likeModel.find()....

        const post: PostDocument & { likes: { likeStatus: LikeStatus }[] } = posts[0];

        let likeStatus: LikeStatus = LikeStatus.None;
        if (post.likes.length !== 0) {
            likeStatus = post.likes[0].likeStatus;
        }

        return post ?
            {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: post.likesCount,
                    dislikesCount: post.dislikesCount,
                    myStatus: likeStatus,
                    newestLikes: [],
                },
            } : null;


    }

}