import { UploadFilePayloadDto } from '../files/s3/dto/upload-file-payload.dto.ts';
import { UploadFileResultDto } from '../files/s3/dto/upload-file-result.dto.ts';
import { RemoveFilePayloadDto } from '../files/s3/dto/remove-file-payload.dto.ts';

export abstract class IFileService {
  abstract uploadFile(dto: UploadFilePayloadDto): Promise<UploadFileResultDto>;

  abstract removeFile(dto: RemoveFilePayloadDto): Promise<void>;
}
