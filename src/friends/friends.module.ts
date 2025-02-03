import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendRequest, FriendRequestSchema } from './schema/friend-request.schema';
import { User, UserSchema } from 'src/auth/schema/user.schema';
import { Chat, ChatSchema } from './schema/chate.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: FriendRequest.name,
      schema: FriendRequestSchema
    },
    {
      name: User.name,
      schema: UserSchema
    },
    {
      name: Chat.name,
      schema: ChatSchema
    }
  ])],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
