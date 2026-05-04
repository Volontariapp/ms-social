import { IsString } from 'class-validator';
import {
  CreateSocialPostCommand,
  DeleteSocialPostCommand,
  PostUserOwnCommand,
  DeleteUserOwnCommand,
  AdminPostUserOwnCommand,
  AdminDeleteUserOwnCommand,
} from '@volontariapp/contracts-nest';

export class CreateSocialPostCommandDTO implements CreateSocialPostCommand {
  @IsString()
  postId!: string;
}

export class DeleteSocialPostCommandDTO implements DeleteSocialPostCommand {
  @IsString()
  postId!: string;
}

export class PostUserOwnCommandDTO implements PostUserOwnCommand {
  @IsString()
  postId!: string;
}

export class DeleteUserOwnCommandDTO implements DeleteUserOwnCommand {
  @IsString()
  postId!: string;
}

export class AdminPostUserOwnCommandDTO implements AdminPostUserOwnCommand {
  @IsString()
  userId!: string;

  @IsString()
  postId!: string;
}

export class AdminDeleteUserOwnCommandDTO implements AdminDeleteUserOwnCommand {
  @IsString()
  userId!: string;

  @IsString()
  postId!: string;
}
