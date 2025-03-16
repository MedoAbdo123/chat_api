import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/User.dto';
import { updateUserDto } from './dto/UpdateUser.dto';
import mongoose from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  @UseInterceptors(
    FileInterceptor('profile', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
    }),
  )
  async RegisterUsers(
    @Body() userDto: UserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      userDto.profile = file.filename;
    }
    return this.authService.RegisterUsers(userDto);
  }

  @Post('login')
  async LoginUser(@Body() userDto: UserDto) {
    return this.authService.LoginUser(userDto);
  }

  @Post('update/:userId')
  @UseInterceptors(
    FileInterceptor('profile', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
    }),
  )
  async updateUser(
    @Body() updateUserDto: updateUserDto,
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateUserDto.profile = file.filename;
    }
    const isValid = mongoose.Types.ObjectId.isValid(userId);
    if (!isValid) throw new UnauthorizedException('Invalid Id');
    return this.authService.updateUser(updateUserDto, userId);
  }

  @Get('search/:username')
  async getUsers(@Param('username') username: string) {
    return this.authService.findUsersByUsername(username);
  }

  @Get('getAllUsers')
  async getAllUsers() {
    return this.authService.getAllUsers();
  }
}