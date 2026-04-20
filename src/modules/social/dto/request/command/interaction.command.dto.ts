import { IsString } from 'class-validator';
import {
  PostLikePostCommand,
  DeleteLikePostCommand,
} from '@volontariapp/contracts-nest';

export class PostLikePostCommandDTO implements PostLikePostCommand {
  @IsString()
  userId!: string;

  @IsString()
  postId!: string;
}

export class DeleteLikePostCommandDTO implements DeleteLikePostCommand {
  @IsString()
  userId!: string;

  @IsString()
  postId!: string;
}
