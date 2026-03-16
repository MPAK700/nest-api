import { Module } from '@nestjs/common';

import { IFileService } from './files.adapter.ts';
import { S3Module } from './s3/s3.module.ts';
import { S3Service } from './s3/s3.service.ts';

@Module({
  imports: [S3Module],
  providers: [
    {
      provide: IFileService,
      useClass: S3Service,
    },
  ],
  exports: [IFileService],
})
export class FilesModule {}
