import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { Logger } from '@volontariapp/logger';
import { SocialEdgeAction, SocialEdgeKind } from '@volontariapp/messaging';
import type { SocialEdgeIntentService } from '@volontariapp/domain-social';
import { SocialEdgeMirrorService } from '../../../modules/social-edge/social-edge-mirror.service.js';
import { createSocialEdgeIntentServiceMock } from './social-edge-mirror.mock.js';
import { EVENT_ID, POST_ID, USER_ID } from './social-edge.factory.js';

describe('SocialEdgeMirrorService', () => {
  let intents: jest.Mocked<SocialEdgeIntentService>;
  let service: SocialEdgeMirrorService;

  beforeEach(() => {
    intents = createSocialEdgeIntentServiceMock();
    service = new SocialEdgeMirrorService(intents, 'sync');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('mirrors an edge through the intent service', async () => {
    const spy = jest.spyOn(intents, 'mirrorEdge').mockResolvedValue(undefined);

    await service.mirror(SocialEdgeKind.LIKE, USER_ID, POST_ID, SocialEdgeAction.ADD);

    expect(spy).toHaveBeenCalledWith(SocialEdgeKind.LIKE, USER_ID, POST_ID, SocialEdgeAction.ADD);
  });

  it('logs and swallows a mirror failure so the RPC answer does not change', async () => {
    jest.spyOn(intents, 'mirrorEdge').mockRejectedValue(new Error('postgres down'));
    const logSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);

    await expect(
      service.mirror(SocialEdgeKind.FOLLOW, USER_ID, POST_ID, SocialEdgeAction.REMOVE),
    ).resolves.toBeUndefined();

    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it('removes the wish of the pair when participating', async () => {
    const spy = jest.spyOn(intents, 'mirrorEdge').mockResolvedValue(undefined);

    await service.mirrorParticipation(USER_ID, EVENT_ID, SocialEdgeAction.ADD);

    expect(spy).toHaveBeenNthCalledWith(
      1,
      SocialEdgeKind.PARTICIPATE,
      USER_ID,
      EVENT_ID,
      SocialEdgeAction.ADD,
    );
    expect(spy).toHaveBeenNthCalledWith(
      2,
      SocialEdgeKind.WISH,
      USER_ID,
      EVENT_ID,
      SocialEdgeAction.REMOVE,
    );
  });

  it('only removes the participation when leaving', async () => {
    const spy = jest.spyOn(intents, 'mirrorEdge').mockResolvedValue(undefined);

    await service.mirrorParticipation(USER_ID, EVENT_ID, SocialEdgeAction.REMOVE);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('deletes the edges of a deleted node', async () => {
    const spy = jest.spyOn(intents, 'deleteEdgesOfNode').mockResolvedValue(3);

    await service.deleteEdgesOfNode(POST_ID);

    expect(spy).toHaveBeenCalledWith(POST_ID);
  });

  it('logs and swallows a cleanup failure', async () => {
    jest.spyOn(intents, 'deleteEdgesOfNode').mockRejectedValue(new Error('postgres down'));

    const logSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);

    await expect(service.deleteEdgesOfNode(POST_ID)).resolves.toBeUndefined();

    expect(logSpy).toHaveBeenCalledTimes(1);
  });
});
