import { IsString } from 'class-validator';

export class CreateMailDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly name: string;
}
