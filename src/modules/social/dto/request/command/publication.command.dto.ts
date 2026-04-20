import { IsString } from 'class-validator';
import {
  CreateSocialPostCommand,
  DeleteSocialPostCommand,
  PostUserOwnCommand,
  DeleteUserOwnCommand,
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
  userId!: string;

  @IsString()
  postId!: string;
}

export class DeleteUserOwnCommandDTO implements DeleteUserOwnCommand {
  @IsString()
  userId!: string;

  @IsString()
  postId!: string;
}
