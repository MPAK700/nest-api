import * as AWS from '@aws-sdk/client-s3';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { IFileService } from '../files.adapter.ts';
import { S3Lib } from './constants/do-spaces-service-lib.constant.ts';
import { RemoveException } from './exceptions/remove.exception.ts';
import { UploadException } from './exceptions/upload.exception.ts';
import { UploadFilePayloadDto } from './dto/upload-file-payload.dto.ts';
import { UploadFileResultDto } from './dto/upload-file-result.dto.ts';
import { RemoveFilePayloadDto } from './dto/remove-file-payload.dto.ts';
import { S3ServiceException } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service extends IFileService {
  private readonly logger = new Logger(S3Service.name);

  // TODO: укажи имя бакета
  private readonly bucketName = 'avatar';

  constructor(@Inject(S3Lib) private readonly S3: AWS.S3) {
    super();
  }

  // TODO: в s3 (error: any) ? async await?
  async uploadFile(dto: UploadFilePayloadDto): Promise<UploadFileResultDto> {
    const { folder, file, name } = dto;
    const path = `${folder}/${name}`;

    this.logger.log('📁 Beginning of uploading file to bucket');

    return new Promise((resolve, reject) => {
      this.S3.putObject(
        {
          Bucket: this.bucketName,
          Key: path,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
        },
        (error) => {
          if (!error) {
            this.logger.log('✅ Uploading was successful');
            resolve({
              path,
            });
          } else {
            this.logger.error(`❌ File upload error with path: ${path}`);
            if (error instanceof S3ServiceException) {
              reject(new UploadException(error.message));
            } else {
              reject(new InternalServerErrorException());
            }
          }
        },
      );
    });
  }

  async removeFile(dto: RemoveFilePayloadDto): Promise<void> {
    const { path } = dto;

    this.logger.log('🗑️ Beginning of removing file from bucket');

    return new Promise((resolve, reject) => {
      this.S3.deleteObject(
        {
          Bucket: this.bucketName,
          Key: path,
        },
        (error) => {
          if (!error) {
            this.logger.log('✅ Removing was successful');
            resolve();
          } else {
            this.logger.error(`❌ File remove error with path: ${path}`);
            if (error instanceof S3ServiceException) {
              reject(new RemoveException(error.message));
            } else {
              reject(new InternalServerErrorException());
            }
          }
        },
      );
    });
  }
}
