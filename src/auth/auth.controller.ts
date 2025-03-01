import { Body, Controller, Get, Param, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/User.dto';
import { updateUserDto } from './dto/UpdateUser.dto';
import mongoose from 'mongoose';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async RegisterUsers(@Body() userDto: UserDto) {
    return this.authService.RegisterUsers(userDto)
  }

  @Post('login')
  async LoginUser(@Body() userDto: UserDto) {
    return this.authService.LoginUser(userDto)
  }

  @Post('update/:userId')
  async updateUser(
    @Body() updateUserDto: updateUserDto,
    @Param('userId') userId: string,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(userId);
    if (!isValid) throw new UnauthorizedException('Invalid Id');
    return this.authService.updateUser(updateUserDto, userId);
  }

  @Get('search/:username')
  async getUsers(@Param('username') username: string) {
    return this.authService.findUsersByUsername(username)
  }
}