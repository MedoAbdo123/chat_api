import { Get, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from './schema/post.schema';
import { CreatePostDto } from './dto/ceatePost.dto';
import { User } from 'src/auth/schema/user.schema';
import { UpadtePostDto } from './dto/updatePost.dto';

@Injectable()
export class PostsService {
    constructor(@InjectModel(Post.name) private PostModel: Model<Post>){}

    async createPost(createPostDto: CreatePostDto, user: any) {
        const { title, body } = createPostDto;
        const newPost = new this.PostModel({
            title,
            body,
            userId: user.id,
            username: user.username,
            email: user.email,
            profile: user.profile,
        });
    
        await newPost.save();
        return newPost;
    }

    async updatePost(updatePostDto: UpadtePostDto, postId: string) {
        if(!Types.ObjectId.isValid(postId)) throw new UnauthorizedException("Post Not Found!")
        
        return this.PostModel.findByIdAndUpdate(postId, updatePostDto,{new: true})      
    }
    
    async deletePost(updatePostDto: UpadtePostDto, postId: string) {
        if(!Types.ObjectId.isValid(postId)) throw new UnauthorizedException("Post Not Found!")
        
        return this.PostModel.findByIdAndDelete(postId, updatePostDto)      
    }

    async getPostsById(userId: string) {
        if(!Types.ObjectId.isValid(userId)) throw new UnauthorizedException("Post Not Found!")
        return this.PostModel.find({userId})
    }  
}