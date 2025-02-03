import { BadRequestException, Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendRequestDto } from './dto/FriendRequst.dto';
import { FriendGuard } from './guard/friend.guard';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('send')
  @UseGuards(FriendGuard)
  sendRequest(@Body() friendRequestDto: FriendRequestDto, @Request() req) {
    return this.friendsService.sendRequest(friendRequestDto,req.user);
  }
  
  @Post('accept/:id')
  acceptRequest(@Param('id') requestId: string) {
    return this.friendsService.acceptFriendRequest(requestId);
  }

  // رفض طلب صداقة
  @Post('decline/:id')
  declineRequest(@Param('id') requestId: string) {
    return this.friendsService.declineRequest(requestId);
  }

  // جلب طلبات الصداقة
  @Get(':userId')
  getRequests(@Param('userId') userId: string) {
    return this.friendsService.getRequests(userId);
  }
  
  @Get()
  async fetchFriends(@Query('userId') userId: string) {
    console.log('Controller: getFriends called with userId:', userId);
    return this.friendsService.getFriends(userId);
  }
  
}