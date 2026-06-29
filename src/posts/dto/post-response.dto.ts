import { ApiProperty } from '@nestjs/swagger';

export class FeedPostDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ nullable: true })
  caption: string | null;

  @ApiProperty()
  url: string;

  @ApiProperty()
  fileType: string;

  @ApiProperty()
  fileName: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  isOwner: boolean;

  @ApiProperty()
  email: string;
}

export class FeedResponseDto {
  @ApiProperty({ type: [FeedPostDto] })
  posts: FeedPostDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;
}

export class DeletePostResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;
}

export class PostResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ nullable: true })
  caption: string | null;

  @ApiProperty()
  url: string;

  @ApiProperty()
  fileType: string;

  @ApiProperty()
  fileName: string;

  @ApiProperty()
  createdAt: string;
}
