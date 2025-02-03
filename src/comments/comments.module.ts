import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comments, CommentsSchema } from './schema/commenst.schema';
import { Post, PostSchema } from 'src/posts/schema/post.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: Comments.name,
      schema: CommentsSchema
    },
    {
      name: Post.name,
      schema: PostSchema
    }
  ])],
  controllers: [CommentsController],
  providers: [CommentsService],
})

export class CommentsModule {}