import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { User } from '../../users/entities/user.entity';

export enum SocialProvider {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  GITHUB = 'github',
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  @MinLength(6)
  password!: string;
}

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username!: string;

  @Field()
  @IsString()
  @MinLength(6)
  password!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;
}

@ObjectType()
export class AuthResponse {
  @Field()
  access_token!: string;

  @Field(() => User)
  user!: User;
}

@InputType()
export class SocialAuthInput {
  @Field()
  provider!: SocialProvider;

  @Field()
  @IsString()
  accessToken!: string;
}

@InputType()
export class PhoneSendInput {
  @Field()
  @IsString()
  phone!: string;
}

@InputType()
export class PhoneVerifyInput {
  @Field()
  @IsString()
  phone!: string;

  @Field()
  @IsString()
  code!: string;
}
