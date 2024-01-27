import { PartialType } from '@nestjs/swagger';
import { Logindto } from './Logindto.dto';

export class UpdateAuthDto extends PartialType(Logindto) { }
