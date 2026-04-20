import { IsString } from 'class-validator';
import {
  CreateSocialEventCommand,
  DeleteSocialEventCommand,
  PostUserEventCommand,
  DeleteUserEventCommand,
  PostUserParticipateEventCommand,
  DeleteUserParticipateEventCommand,
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
  userId!: string;

  @IsString()
  eventId!: string;
}

export class DeleteUserParticipateEventCommandDTO implements DeleteUserParticipateEventCommand {
  @IsString()
  userId!: string;

  @IsString()
  eventId!: string;
}
