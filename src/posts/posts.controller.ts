import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/ceatePost.dto';
import { PostGuard } from './guard/post.guard';
import { UpadtePostDto } from './dto/updatePost.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('posts')
@UseInterceptors(
  FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post("createPost")
  @UseGuards(PostGuard)
  async createPost(@Body() createPostDto: CreatePostDto, @Request() req, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      createPostDto.image = file.filename;
    }
    return this.postsService.createPost(createPostDto, req.user);
  }

  @Patch("update/:postId")
  async updatePost(@Body() updatePostDto: UpadtePostDto, @Param('postId') postId: string) {
    return this.postsService.updatePost(updatePostDto, postId);
  }

  @Delete("delete/:postId")
  async deletePost(updatePostDto: UpadtePostDto, @Param('postId') postId: string) {
    return this.postsService.deletePost(updatePostDto,postId);
  }

  @Get("getPosts/:userId")
  async getPostsById(@Param('userId') userId: string) {
    return this.postsService.getPostsById(userId);
  }

  @Get("getPosts")
  async getAllPosts() {
    return await this.postsService.getAllPosts();
  }
}