import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comments } from './schema/commenst.schema';
import { Model, Types } from 'mongoose';
import { Post } from 'src/posts/schema/post.schema';
import { CommentDto } from './dto/Comment.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comments.name) private commentsModel: Model<Comments>, 
        @InjectModel(Post.name) private PostModel: Model<Post>, 
    ){}

    async addComment(commentsDto: CommentDto, postId: string, user: any) {
        if (!Types.ObjectId.isValid(postId)) {
            throw new NotFoundException("Post Not Found!");
        }
    
        const post = await this.PostModel.findById(postId);
        if (!post) {
            throw new NotFoundException("Post Not Found!");
        }
    
        const { text } = commentsDto;
    
        const commentSave = await new this.commentsModel({
            text,
            userId: user.id,
            username: user.username,
            email: user.email,
            profile: user.profile
        }).save();
    
        post.comments.push(commentSave._id);
        return post.save();
    }

    async getPostWithComments(postId: string) {
        if (!Types.ObjectId.isValid(postId)) {
            throw new NotFoundException("Post Not Found!");
        }
    
        const post = await this.PostModel.findById(postId)
            .populate({
                path: 'comments',
                model: 'Comments',
                populate: {
                    path: 'userId',
                    model: 'User',
                    select: 'username email profile' 
                }
            })
            .exec();
    
        if (!post) {
            throw new NotFoundException("Post Not Found!");
        }
    
        return post;
    }
}