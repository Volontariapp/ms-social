import { IsString } from 'class-validator';
import {
  CreateSocialEventCommand,
  DeleteSocialEventCommand,
  PostUserEventCommand,
  DeleteUserEventCommand,
  PostUserParticipateEventCommand,
  DeleteUserParticipateEventCommand,
  PostUserWishEventCommand,
  DeleteUserWishEventCommand,
  AdminPostUserParticipateEventCommand,
  AdminDeleteUserParticipateEventCommand,
  AdminPostUserWishEventCommand,
  AdminDeleteUserWishEventCommand,
} from '@volontariapp/contracts-nest';

export class CreateSocialEventCommandDTO implements CreateSocialEventCommand {
  @IsString()
  eventId!: string;
}

export class DeleteSocialEventCommandDTO implements DeleteSocialEventCommand {
  @IsString()
  eventId!: string;
}

export class PostUserEventCommandDTO implements PostUserEventCommand {
  @IsString()
  userId!: string;

  @IsString()
  eventId!: string;
}

export class DeleteUserEventCommandDTO implements DeleteUserEventCommand {
  @IsString()
  userId!: string;

  @IsString()
  eventId!: string;
}

export class PostUserParticipateEventCommandDTO implements PostUserParticipateEventCommand {
  @IsString()
  eventId!: string;
}

export class DeleteUserParticipateEventCommandDTO implements DeleteUserParticipateEventCommand {
  @IsString()
  eventId!: string;
}

export class PostUserWishEventCommandDTO implements PostUserWishEventCommand {
  @IsString()
  eventId!: string;
}

export class DeleteUserWishEventCommandDTO implements DeleteUserWishEventCommand {
  @IsString()
  eventId!: string;
}

export class AdminPostUserParticipateEventCommandDTO
  implements AdminPostUserParticipateEventCommand
{
  @IsString()
  userId!: string;

  @IsString()
  eventId!: string;
}

export class AdminDeleteUserParticipateEventCommandDTO
  implements AdminDeleteUserParticipateEventCommand
{
  @IsString()
  userId!: string;

  @IsString()
  eventId!: string;
}

export class AdminPostUserWishEventCommandDTO implements AdminPostUserWishEventCommand {
  @IsString()
  userId!: string;

  @IsString()
  eventId!: string;
}

export class AdminDeleteUserWishEventCommandDTO implements AdminDeleteUserWishEventCommand {
  @IsString()
  userId!: string;

  @IsString()
  eventId!: string;
}
