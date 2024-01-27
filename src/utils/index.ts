import { HttpException } from '@nestjs/common';

export const ReturnError = (msg, code) => {
  throw new HttpException(msg, code);
};
