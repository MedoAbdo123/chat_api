import { Get, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from './schema/post.schema';
import { CreatePostDto } from './dto/ceatePost.dto';
import { UpadtePostDto } from './dto/updatePost.dto';
import { User } from 'src/auth/schema/user.schema';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private PostModel: Model<Post>,
        @InjectModel(User.name) private UserModel: Model<User>
    ) { }

    async createPost(createPostDto: CreatePostDto, user: any) {
        const { title, body, image } = createPostDto;
        const baseUrl = 'http://localhost:3000/uploads/';
        const newPost = new this.PostModel({
            title,
            body,
            userId: user.id,
            username: user.username,
            image: baseUrl + image,
            email: user.email,
            profile: user.profile,
        });

        await newPost.save();
        return newPost;
    }

    async updatePost(updatePostDto: UpadtePostDto, postId: string) {
        if (!Types.ObjectId.isValid(postId)) throw new UnauthorizedException("Post Not Found!")

        return this.PostModel.findByIdAndUpdate(postId, updatePostDto, { new: true })
    }

    async deletePost(updatePostDto: UpadtePostDto, postId: string) {
        if (!Types.ObjectId.isValid(postId)) throw new UnauthorizedException("Post Not Found!")

        return this.PostModel.findByIdAndDelete(postId, updatePostDto)
    }

    async getPostsById(userId: string) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new NotFoundException("User Not Found!");
        }

        const posts = await this.PostModel.find({ userId });
        const user = await this.UserModel.findById(userId);

        return { user, posts };
    }

    async getByPostId(postId: string) {
        if (!Types.ObjectId.isValid(postId)) {
            throw new NotFoundException("Poste Not Found...")
        }
        const post = await this.PostModel.findById({ _id: postId })
        return post
    }

    async getAllPosts() {
        return await this.PostModel.find().sort({ createdAt: -1 });
    }
}