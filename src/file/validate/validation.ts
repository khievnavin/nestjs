import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any) {
    // "value" is an object containing the file's attributes and metadata ,metadata: ArgumentMetadata
    const oneKb = 1000;
    return value.size < oneKb;
  }
}
