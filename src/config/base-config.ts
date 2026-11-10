import { BackendConfig, MSURLsConfig, Neo4jConfig, PostgresConfig } from '@volontariapp/config';
import { Type } from 'class-transformer';
import { IsDefined, IsIn, IsOptional, ValidateNested } from 'class-validator';

export class CustomConfig extends BackendConfig {
  @IsDefined()
  @Type(() => Number)
  declare port: number;

  @IsDefined()
  @ValidateNested()
  @Type(() => MSURLsConfig)
  declare microServices: MSURLsConfig;

  @IsDefined()
  @ValidateNested()
  @Type(() => Neo4jConfig)
  neo4j!: Neo4jConfig;

  @IsDefined()
  @ValidateNested()
  @Type(() => PostgresConfig)
  db!: PostgresConfig;

  /** L9 write mode: only `sync` (double write Neo4j + social_edge) is wired for now. */
  @IsOptional()
  @IsIn(['sync', 'async'])
  socialWriteMode?: string;
}
