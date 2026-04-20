import { IsString } from 'class-validator';
import { GetSocialUserQuery } from '@volontariapp/contracts-nest';

export class GetSocialUserQueryDTO implements GetSocialUserQuery {
  @IsString()
  userId!: string;
}
