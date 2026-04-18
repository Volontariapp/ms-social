import { IsString } from 'class-validator';
import {
  LinkPostToEventCommand,
  UnlinkPostFromEventCommand,
} from '@volontariapp/contracts-nest';

export class LinkPostToEventCommandDTO implements LinkPostToEventCommand {
  @IsString()
  postId!: string;

  @IsString()
  eventId!: string;
}

export class UnlinkPostFromEventCommandDTO implements UnlinkPostFromEventCommand {
  @IsString()
  postId!: string;

  @IsString()
  eventId!: string;
}
