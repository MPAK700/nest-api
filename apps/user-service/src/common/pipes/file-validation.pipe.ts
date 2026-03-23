import {
  Injectable,
  PipeTransform,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly allowedTypes: string[];
  private readonly maxSize: number;
  private readonly logger = new Logger(FileValidationPipe.name);

  constructor(private readonly configService: ConfigService) {
    this.allowedTypes = this.configService
      .get<string>('AVATAR_ALLOWED_TYPES', 'image/png,image/jpeg')
      .split(',');
    this.maxSize = parseInt(
      this.configService.get<string>(
        'AVATAR_MAX_SIZE',
        (10 * 1024 * 1024).toString(),
      ),
      10,
    );
    this.logger.log(
      `Allowed types: ${this.allowedTypes.join(', ')}, Max size: ${this.maxSize}`,
    );
  }

  transform(file: Express.Multer.File) {
    if (!file) {
      this.logger.warn('No file uploaded');
      return file;
    }

    if (!this.allowedTypes.includes(file.mimetype)) {
      this.logger.warn(`Rejected file type: ${file.mimetype}`);
      throw new BadRequestException(`File type ${file.mimetype} not allowed`);
    }

    if (file.size > this.maxSize) {
      this.logger.warn(`Rejected file size: ${file.size}`);
      throw new BadRequestException(
        `File too large. Max size is ${this.maxSize} bytes`,
      );
    }

    this.logger.log(`File passed validation: `);
    return file;
  }
}
