import { CreateAdminInput } from './create-admin.input';
import { PartialType } from '@nestjs/mapped-types';
import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateAdminInput extends PartialType(CreateAdminInput) {
  @Field(() => ID)
  id_admin: number;
}
