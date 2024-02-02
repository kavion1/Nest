import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { extname } from "path";

export class CreateUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsNotEmpty()
  file: any;

  validateFileTypes(fileTypes: string[]) {
    const fileExtName = extname(this['file'].originalname);
    return fileTypes.includes(fileExtName);
  }
}
