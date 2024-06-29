import { Post, PostDocument, PostModelType } from '../domain/posts.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PostsViewDto } from '../api/dto/output/extendedLikesInfoView.dto';
import { UserViewDto } from '../../users/api/dto/output/userViewDto';
import { Paginator } from '../../../common/dto/paginator.dto';
import { QueryDto } from '../../../common/dto/query.dto';

export class PostsQueryRepository {
    constructor(
        @InjectModel(Post.name) private postModel: PostModelType,
    ) {
    }

    async findPosts(query: Omit<QueryDto, 'searchNameTerm' | 'searchEmailTerm' | 'searchLoginTerm'>) {
        const countPosts = await this.postModel.find({ isDeleted: false }).countDocuments();
        const posts: PostDocument[] = await this.postModel.aggregate([
            {
                $match: {
                    isDeleted: false,
                },
            },
            { $sort: { [query.sortBy]: query.sortDirection as 1 | -1 } },
            { $skip: (query.pageNumber - 1) * query.pageSize },
            { $limit: query.pageSize },
        ]).exec();

        let mappedPosts: PostsViewDto[] = [];
        posts.map(post => {
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
                        myStatus: post.myStatus,
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

    async findPostsForBlog(query: Omit<QueryDto, 'searchNameTerm' | 'searchEmailTerm' | 'searchLoginTerm'>, blogId: string) {
        const countPosts = await this.postModel.find({ blogId: blogId, isDeleted: false }).countDocuments();
        const posts: PostDocument[] = await this.postModel.aggregate([
            {
                $match: {
                    blogId: blogId,
                    isDeleted: false,
                },
            },
            { $sort: { [query.sortBy]: query.sortDirection as 1 | -1 } },
            { $skip: (query.pageNumber - 1) * query.pageSize },
            { $limit: query.pageSize },
        ]).exec();

        let mappedPosts: PostsViewDto[] = [];
        posts.map(post => {
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
                        myStatus: post.myStatus,
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

    async findPost(postId: string): Promise<PostsViewDto> {
        const post = await this.postModel.findOne(
            { _id: postId, isDeleted: false },
            {
                _id: 0,
                id: { $toString: '$_id' },
                title: 1,
                shortDescription: 1,
                content: 1,
                blogId: 1,
                blogName: 1,
                createdAt: 1,
                likesCount: 1,
                dislikesCount: 1,
                myStatus: 1,
            },
        ).lean();

        //todo нужно добавить поиск настоящих лайков со временем

        // const newestLikes = this.likeModel.find()....


        return post ?
            {
                id: post.id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: post.likesCount,
                    dislikesCount: post.dislikesCount,
                    myStatus: post.myStatus,
                    newestLikes: [],
                },
            } : null;


    }

}