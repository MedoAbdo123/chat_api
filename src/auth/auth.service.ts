import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model, Types } from 'mongoose';
import { UserDto } from './dto/User.dto';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { updateUserDto } from './dto/UpdateUser.dto';
import { LoginUserDto } from './dto/LoginUser.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService
    ) { }

    async RegisterUsers(userDto: UserDto) {
        const { username, email, password, profile } = userDto;

        const userExists = await this.userModel.findOne({ email });
        if (userExists) throw new UnauthorizedException("This email already exists");

        const hashPassword = await bcrypt.hash(password, 10);
        const baseUrl = 'http://localhost:3000/uploads/';
        const newUser = new this.userModel({
            username,
            email,
            password: hashPassword,
            profile: baseUrl + profile,
        });

        await newUser.save();

        const token = this.jwtService.sign({
            id: newUser._id,
            email: email,
            username: username,
            profile: baseUrl + profile,
        });

        return {
            user: newUser,
            token,
            message: "User has been registered successfully"
        };
    }

    async LoginUser(loginDto: LoginUserDto) {
        const { email, password } = loginDto;

        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new UnauthorizedException("Error email or password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Error email or password");
        }

        const token = this.jwtService.sign({
            id: user._id,
            username: user.username,
            email: user.email,
            profile: user.profile
        });


        return {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profile: user.profile
            },
            token,
        };
    }

    async updateUser(updateUserDto: updateUserDto, userId: string) {
        const baseUrl = 'http://localhost:3000/uploads/';

        if (updateUserDto.profile) {
            updateUserDto.profile = baseUrl + updateUserDto.profile;
        }
        return this.userModel.findByIdAndUpdate(userId, updateUserDto, { new: false });
    }

    async findUsersByUsername(username: string) {
        const users = await this.userModel.find({
            username: { $regex: username, $options: 'i' }
        });

        if (users.length === 0) {
            throw new UnauthorizedException('No users found!');
        }

        return users;
    }

    async getAllUsers(userId: string) {
        return await this.userModel.find({ _id: { $ne: userId } });
    }
}