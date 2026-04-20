import { IsString } from 'class-validator';
import {
  PostFollowUserCommand,
  DeleteFollowUserCommand,
  PostBlockUserCommand,
  DeleteBlockUserCommand,
} from '@volontariapp/contracts-nest';

export class PostFollowUserCommandDTO implements PostFollowUserCommand {
  @IsString()
  followerId!: string;

  @IsString()
  followedId!: string;
}

export class DeleteFollowUserCommandDTO implements DeleteFollowUserCommand {
  @IsString()
  followerId!: string;

  @IsString()
  followedId!: string;
}

export class PostBlockUserCommandDTO implements PostBlockUserCommand {
  @IsString()
  blockerId!: string;

  @IsString()
  blockedId!: string;
}

export class DeleteBlockUserCommandDTO implements DeleteBlockUserCommand {
  @IsString()
  blockerId!: string;

  @IsString()
  blockedId!: string;
}
