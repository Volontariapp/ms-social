import { IsString } from 'class-validator';
import {
  PostLikePostCommand,
  DeleteLikePostCommand,
  AdminPostLikePostCommand,
  AdminDeleteLikePostCommand,
} from '@volontariapp/contracts-nest';

export class PostLikePostCommandDTO implements PostLikePostCommand {
  @IsString()
  postId!: string;
}

export class DeleteLikePostCommandDTO implements DeleteLikePostCommand {
  @IsString()
  postId!: string;
}

export class AdminPostLikePostCommandDTO implements AdminPostLikePostCommand {
  @IsString()
  userId!: string;

  @IsString()
  postId!: string;
}

export class AdminDeleteLikePostCommandDTO implements AdminDeleteLikePostCommand {
  @IsString()
  userId!: string;

  @IsString()
  postId!: string;
}
