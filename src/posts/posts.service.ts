import {
  BadGatewayException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageKitService } from '../media/imagekit.service';
import { FeedQueryDto } from './dto/feed-query.dto';
import {
  FeedPostDto,
  FeedResponseDto,
  PostResponseDto,
} from './dto/post-response.dto';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly imageKitService: ImageKitService,
  ) {}

  async createPost(
    userId: string,
    file: Express.Multer.File,
    caption: string,
  ): Promise<PostResponseDto> {
    try {
      const uploadResult = await this.imageKitService.upload(
        file.buffer,
        file.originalname,
      );

      const contentType: string = file.mimetype ?? '';
      const post: Post = this.postsRepository.create({
        userId,
        caption: caption || null,
        url: uploadResult.url,
        fileType: contentType.startsWith('video/') ? 'video' : 'image',
        fileName: uploadResult.name,
        imagekitFileId: uploadResult.fileId,
      });

      const saved: Post = await this.postsRepository.save(post);
      return this.toPostResponse(saved);
    } catch {
      throw new BadGatewayException('Media upload failed');
    }
  }

  async getFeed(
    userId: string,
    query: FeedQueryDto,
  ): Promise<FeedResponseDto> {
    const [posts, total] = await this.postsRepository.findAndCount({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: query.limit,
      skip: query.offset,
    });

    const feedPosts: FeedPostDto[] = posts.map((post: Post) => ({
      id: post.id,
      userId: post.userId,
      caption: post.caption,
      url: post.url,
      fileType: post.fileType,
      fileName: post.fileName,
      createdAt: post.createdAt.toISOString(),
      isOwner: post.userId === userId,
      email: post.user?.email ?? 'Unknown',
    }));

    return {
      posts: feedPosts,
      total,
      limit: query.limit,
      offset: query.offset,
    };
  }

  async deletePost(userId: string, postId: string): Promise<void> {
    const post: Post | null = await this.postsRepository.findOne({
      where: { id: postId },
    });

    if (post === null) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException(
        "You don't have permission to delete this post",
      );
    }

    if (post.imagekitFileId) {
      try {
        await this.imageKitService.delete(post.imagekitFileId);
      } catch {
        // File may already be removed from ImageKit
      }
    }

    await this.postsRepository.remove(post);
  }

  private toPostResponse(post: Post): PostResponseDto {
    return {
      id: post.id,
      userId: post.userId,
      caption: post.caption,
      url: post.url,
      fileType: post.fileType,
      fileName: post.fileName,
      createdAt: post.createdAt.toISOString(),
    };
  }
}
