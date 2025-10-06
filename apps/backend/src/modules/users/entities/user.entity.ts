import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field()
  username!: string;

  @Field({ nullable: true })
  firstName?: string | null;

  @Field({ nullable: true })
  lastName?: string | null;

  @Field({ nullable: true })
  isActive?: boolean | null;

  @Field({ nullable: true })
  isVerified?: boolean | null;

  @Field({ nullable: true })
  createdAt?: Date | null;

  @Field({ nullable: true })
  updatedAt?: Date | null;

  // Note: passwordHash is intentionally not exposed via GraphQL
}
