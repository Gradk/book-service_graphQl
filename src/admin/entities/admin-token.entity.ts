import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AdminEntityToken {
  @Field(() => ID)
  id_admin: number;

  @Field()
  createdAt: Date;

  @Field()
  upatedAt: Date;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  confirmEmail: boolean;

  @Field()
  token: string;
}
