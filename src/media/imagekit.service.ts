import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ImageKit from 'imagekit';
import { AppConfig } from '../core/config/configuration';

export interface ImageKitUploadResult {
  url: string;
  fileId: string;
  name: string;
}

@Injectable()
export class ImageKitService {
  private readonly client: ImageKit;

  constructor(configService: ConfigService<AppConfig, true>) {
    this.client = new ImageKit({
      privateKey: configService.get('imagekitPrivateKey', { infer: true }),
      publicKey: configService.get('imagekitPublicKey', { infer: true }),
      urlEndpoint: configService.get('imagekitUrl', { infer: true }),
    });
  }

  async upload(
    fileBuffer: Buffer,
    fileName: string,
  ): Promise<ImageKitUploadResult> {
    const result = await this.client.upload({
      file: fileBuffer,
      fileName,
      useUniqueFileName: true,
      tags: ['pulse-net-nest'],
    });

    return {
      url: result.url,
      fileId: result.fileId,
      name: result.name,
    };
  }

  async delete(fileId: string): Promise<void> {
    await this.client.deleteFile(fileId);
  }
}
