import { IsString } from 'class-validator';
import {
  PostFollowUserCommand,
  DeleteFollowUserCommand,
  PostBlockUserCommand,
  DeleteBlockUserCommand,
  AdminPostFollowUserCommand,
  AdminDeleteFollowUserCommand,
  AdminPostBlockUserCommand,
  AdminDeleteBlockUserCommand,
} from '@volontariapp/contracts-nest';

export class PostFollowUserCommandDTO implements PostFollowUserCommand {
  @IsString()
  followedId!: string;
}

export class DeleteFollowUserCommandDTO implements DeleteFollowUserCommand {
  @IsString()
  followedId!: string;
}

export class PostBlockUserCommandDTO implements PostBlockUserCommand {
  @IsString()
  blockedId!: string;
}

export class DeleteBlockUserCommandDTO implements DeleteBlockUserCommand {
  @IsString()
  blockedId!: string;
}

export class AdminPostFollowUserCommandDTO implements AdminPostFollowUserCommand {
  @IsString()
  followerId!: string;

  @IsString()
  followedId!: string;
}

export class AdminDeleteFollowUserCommandDTO implements AdminDeleteFollowUserCommand {
  @IsString()
  followerId!: string;

  @IsString()
  followedId!: string;
}

export class AdminPostBlockUserCommandDTO implements AdminPostBlockUserCommand {
  @IsString()
  blockerId!: string;

  @IsString()
  blockedId!: string;
}

export class AdminDeleteBlockUserCommandDTO implements AdminDeleteBlockUserCommand {
  @IsString()
  blockerId!: string;

  @IsString()
  blockedId!: string;
}
