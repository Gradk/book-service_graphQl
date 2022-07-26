import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAdminInput {
  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  password: string;
}
