import { HttpStatus, Injectable, type NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { Neo4jWarmer } from './neo4j-warmer.js';

/**
 * In front of GET /health (the readiness probe, served by @volontariapp/health-check-nest):
 * answers 503 while the warm-up after a Neo4j restart runs, so Kubernetes takes the pod out of
 * the headless Service and the gateway fails fast instead of overloading a cold Neo4j.
 */
@Injectable()
export class WarmupReadinessMiddleware implements NestMiddleware {
  constructor(private readonly warmer: Neo4jWarmer) {}

  use(_request: Request, response: Response, next: NextFunction): void {
    if (this.warmer.isReady()) {
      next();
      return;
    }
    response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
      status: 'error',
      error: { neo4j: { status: 'down', message: 'Neo4j warm-up in progress' } },
    });
  }
}
