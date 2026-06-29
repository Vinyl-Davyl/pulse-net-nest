import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { MediaModule } from './media/media.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [CoreModule, UsersModule, AuthModule, MediaModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
