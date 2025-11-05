import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum AuthProviderModel {
  LOCAL = 'local',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

registerEnumType(AuthProviderModel, { name: 'AuthProvider' });

@ObjectType('User')
export class PublicUserModel {
  @Field()
  id!: string;

  @Field()
  email!: string;

  @Field()
  fullName!: string;

  @Field({ nullable: true })
  avatarUrl?: string | null;

  @Field(() => AuthProviderModel)
  provider!: AuthProviderModel;

  @Field()
  emailVerified!: boolean;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
