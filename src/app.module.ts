import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { FriendsModule } from './friends/friends.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1/CHATE_API'),
    AuthModule,
    PostsModule,
    CommentsModule,
    FriendsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
