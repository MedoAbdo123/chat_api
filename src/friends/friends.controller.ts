import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendRequestDto } from './dto/FriendRequst.dto';
import { FriendGuard } from './guard/friend.guard';
import { ChatDto } from './dto/chate.dto';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) { }

  @Post('send')
  @UseGuards(FriendGuard)
  sendRequest(@Body() friendRequestDto: FriendRequestDto, @Request() req) {
    return this.friendsService.sendRequest(friendRequestDto, req.user);
  }

  @Post('accept/:id')
  acceptRequest(@Param('id') requestId: string) {
    return this.friendsService.acceptFriendRequest(requestId);
  }

  @Post('decline/:id')
  declineRequest(@Param('id') requestId: string) {
    return this.friendsService.declineRequest(requestId);
  }

  @Get(':userId')
  getRequests(@Param('userId') userId: string) {
    return this.friendsService.getRequests(userId);
  }

  @Get()
  async fetchFriends(@Query('userId') userId: string) {
    console.log('Controller: getFriends called with userId:', userId);
    return this.friendsService.getFriends(userId);
  }

  @Post('send-message')
  @UseGuards(FriendGuard)
  async sendMessage(@Body() chatDto: ChatDto, @Request() req) {
    return await this.friendsService.sendMessage(chatDto, req.user);
  }

  @Get(':chatId/messages')
  async getMessages(@Param('chatId') chatId: string) {
    return this.friendsService.getMessages(chatId);
  }
}