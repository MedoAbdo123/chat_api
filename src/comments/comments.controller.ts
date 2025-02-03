import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentDto } from './dto/Comment.dto';
import { CommentGuard } from './guard/comment.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post("addComment/:postId")
  @UseGuards(CommentGuard)
  async addComments(@Body() commentsDto: CommentDto,@Param('postId') postId: string, @Request() req) {
    return this.commentsService.addComment(commentsDto, postId, req.user)
  }

  @Get("getComments/:postId")
  async getComment(@Param('postId') postId: string){
    return this.commentsService.getPostWithComments(postId)
  }
}