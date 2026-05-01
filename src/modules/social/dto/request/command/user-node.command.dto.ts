import { IsString } from 'class-validator';
import { CreateSocialUserCommand, DeleteSocialUserCommand } from '@volontariapp/contracts-nest';

export class CreateSocialUserCommandDTO implements CreateSocialUserCommand {
  @IsString()
  userId!: string;
}

export class DeleteSocialUserCommandDTO implements DeleteSocialUserCommand {
  @IsString()
  userId!: string;
}
