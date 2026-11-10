import type { jest } from '@jest/globals';
import type { SocialEdgeIntentService } from '@volontariapp/domain-social';
import type { SocialEdgeMirrorService } from '../../../modules/social-edge/social-edge-mirror.service.js';
import { createMock } from '../../utils/mock.helper.js';

export const createSocialEdgeMirrorMock = (): jest.Mocked<SocialEdgeMirrorService> =>
  createMock<SocialEdgeMirrorService>();

export const createSocialEdgeIntentServiceMock = (): jest.Mocked<SocialEdgeIntentService> =>
  createMock<SocialEdgeIntentService>();
