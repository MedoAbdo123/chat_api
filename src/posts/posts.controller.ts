import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/ceatePost.dto';
import { PostGuard } from './guard/post.guard';
import { Types } from 'mongoose';
import { UpadtePostDto } from './dto/updatePost.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post("createPost")
  @UseGuards(PostGuard)
  async createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.createPost(createPostDto, req.user);
  }
  
  @Patch("update/:postId")
  async updatePost(@Body() updatePostDto: UpadtePostDto,@Param('postId') postId: string){
    return this.postsService.updatePost(updatePostDto, postId)
  }

  @Delete("delete/:postId")
  async deletePost(@Body() updatePostDto: UpadtePostDto,@Param('postId') postId: string){
    return this.postsService.deletePost(updatePostDto, postId)
  }

  @Get("getPosts/:userId")
  async getPostsById(@Param('userId') userId: string){
    return this.postsService.getPostsById(userId)
  }

  @Get("getPosts")
  async getAllPosts(){
    return await this.postsService.getAllPosts()  
  }
}