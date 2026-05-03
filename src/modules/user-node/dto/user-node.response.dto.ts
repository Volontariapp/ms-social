import type {
  CreateUserNodeResponse,
  DeleteUserNodeResponse,
  GetUserNodeResponse,
} from '@volontariapp/contracts-nest';
import { SuccessResponseDTO, ExistsResponseDTO } from '../../../common/dto/base.response.dto.js';

export class CreateUserNodeResponseDTO
  extends SuccessResponseDTO
  implements CreateUserNodeResponse {}

export class DeleteUserNodeResponseDTO
  extends SuccessResponseDTO
  implements DeleteUserNodeResponse {}

export class GetUserNodeResponseDTO extends ExistsResponseDTO implements GetUserNodeResponse {}
