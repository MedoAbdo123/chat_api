import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FriendRequest } from './schema/friend-request.schema';
import { FriendRequestDto } from './dto/FriendRequst.dto';
import { User } from 'src/auth/schema/user.schema';
import { Chat } from './schema/chate.schema';
import { FriendsGateway } from './friend.gateway';
import { ChatDto } from './dto/chate.dto';
@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(FriendRequest.name) private friendRequestModel: Model<FriendRequest>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    private friendsGateway: FriendsGateway
  ) { }

  async sendRequest(friendRequestDto: FriendRequestDto, user: any) {
    const { senderId, receiverId } = friendRequestDto

    if (!receiverId) {
      throw new BadRequestException("Missing receiverId")
    }


    const sendRequest = await this.friendRequestModel.create({
      senderId: user.id,
      receiverId,
      username: user.username,
      email: user.email,
      profile: user.profile
    })
    const existingRequest = await this.friendRequestModel.findOne({ senderId, receiverId })
    if (existingRequest) {
      throw new BadRequestException('A friend request already exists between these users.');
    }

    return sendRequest
  }

  async acceptFriendRequest(requestId: string) {
    try {
      const request = await this.friendRequestModel.findById(requestId);
      if (!request) {
        throw new Error('Friend request not found');
      }

      request.status = 'accepted';
      await request.save();

      let chat = await this.chatModel.findOne({
        participants: { $all: [request.senderId, request.receiverId] }
      });

      if (!chat) {
        chat = new this.chatModel({
          participants: [request.senderId, request.receiverId]
        });
        await chat.save();
      }

      this.friendsGateway.server.to(request.senderId.toString()).emit('newChat', { chatId: chat._id });
      this.friendsGateway.server.to(request.receiverId.toString()).emit('newChat', { chatId: chat._id });

      return { message: 'Friend request accepted', chatId: chat._id };
    } catch (error) {
      throw new Error('Failed to accept friend request');
    }
  }


  async declineRequest(requestId: string) {
    const request = await this.friendRequestModel.findById(requestId);
    if (!request) throw new NotFoundException('Friend request not found');

    request.status = 'declined';
    request.save();
    return request.deleteOne()
  }

  async getRequests(userId: string) {
    return await this.friendRequestModel.find({ receiverId: userId })
  }

  async getFriends(userId: string) {
    try {
      console.log('getFriends function called with userId:', userId);

      const acceptedRequests = await this.friendRequestModel.find({
        $or: [
          { senderId: userId, status: 'accepted' },
          { receiverId: userId, status: 'accepted' }
        ]
      });

      console.log('Accepted Requests:', acceptedRequests);

      const friendIds = acceptedRequests.map(request =>
        request.senderId.toString() === userId ? request.receiverId.toString() : request.senderId.toString()
      );

      console.log('Friend IDs:', friendIds);

      const friends = await this.userModel.find({ _id: { $in: friendIds } }).select('-password');

      const friendsWithChat = await Promise.all(
        friends.map(async (friend) => {
          const chat = await this.chatModel.findOne({
            participants: { $all: [userId, friend._id] }
          });

          return {
            ...friend.toObject(),
            chatId: chat ? chat._id : null
          };
        })
      );

      console.log('Friends with Chat:', friendsWithChat);

      return friendsWithChat;
    } catch (error) {
      console.error('Error in getFriends:', error);
      throw new Error('Failed to fetch friends');
    }
  }

  async sendMessage(chatDto: ChatDto, user: any) {
    const { chatId, senderId, message } = chatDto;
    const chatObjectId = new Types.ObjectId(chatId);

    const chat = await this.chatModel.findById(chatObjectId)
      .populate('participants', 'username email profile')
      .exec();
    if (!chat) {
      throw new Error('Chat not found');
    }

    const messageData = {
      sender: user.id,
      message,
      username: user.username,
      profile: user.profile,
      timestamp: new Date()
    };

    chat.messages.push(messageData);
    await chat.save();

    return { message: 'Message sent', chatId, messageData };
  }

  async getMessages(chatId: string) {
    const chatObjectId = new Types.ObjectId(chatId);

    const chat = await this.chatModel.findById(chatObjectId)
      .populate({
        path: 'messages',
        populate: {
          path: 'sender', // جلب بيانات المرسل لكل رسالة
          model: 'User',
          select: 'username profile', // تحديد الحقول المطلوبة فقط
        },
      })
      .exec();

    if (!chat) {
      throw new Error('Chat not found');
    }

    return chat.messages;
  }
}