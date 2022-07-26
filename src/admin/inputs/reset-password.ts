import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ResetPasswordAdminInput {
  @Field()
  email: string;

  @Field()
  code: string;

  @Field()
  password: string;
}
