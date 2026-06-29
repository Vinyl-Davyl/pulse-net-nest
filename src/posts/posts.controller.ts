import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { FeedQueryDto } from './dto/feed-query.dto';
import {
  DeletePostResponseDto,
  FeedResponseDto,
  PostResponseDto,
} from './dto/post-response.dto';
import { PostsService } from './posts.service';

@ApiTags('posts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        caption: { type: 'string' },
      },
      required: ['file'],
    },
  })
  @ApiCreatedResponse({ type: PostResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('caption') caption: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<PostResponseDto> {
    return this.postsService.createPost(user.userId, file, caption ?? '');
  }

  @Get('feed')
  @ApiOkResponse({ type: FeedResponseDto })
  getFeed(
    @Query() query: FeedQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<FeedResponseDto> {
    return this.postsService.getFeed(user.userId, query);
  }

  @Delete('posts/:postId')
  @ApiOkResponse({ type: DeletePostResponseDto })
  async deletePost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<DeletePostResponseDto> {
    await this.postsService.deletePost(user.userId, postId);
    return { success: true, message: 'Post deleted successfully' };
  }
}
