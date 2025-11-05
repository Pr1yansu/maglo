import { Field, ObjectType } from '@nestjs/graphql';
import { PublicUserModel } from './public-user.model';

@ObjectType()
export class AuthPayloadModel {
  @Field()
  accessToken!: string;

  @Field(() => PublicUserModel)
  user!: PublicUserModel;
}
