import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schema/post.schema';
import { User, UserSchema } from 'src/auth/schema/user.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: Post.name,
      schema: PostSchema
    },
    {
      name: User.name,
      schema: UserSchema
    }
  ])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
