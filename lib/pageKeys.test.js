/* eslint-env mocha */

// npm imports
import { normstr } from '@karmaniverous/tagged-templates';
import { expect } from 'chai';
import _ from 'lodash';
import { nanoid } from 'nanoid';

// Configure entity0 manager.
import { EntityManager } from '@karmaniverous/entity-manager';
import entityConfig from '../test/entityConfig.js';
const entityManager = new EntityManager({ config: entityConfig });

// text imports
import { dehydratePageKeys, rehydratePageKeys } from './pageKeys.js';

describe('pageKeys', function () {
  describe('dehydrate - rehydrate', function () {
    const displayName = 'Test Group';
    let now;
    let entity0;
    let entity1;

    beforeEach(function () {
      now = Date.now();

      entity0 = entityManager.addKeys('group', {
        created: now,
        displayName,
        displayNameCanonical: normstr(displayName),
        groupId: nanoid(),
        updated: now,
      });

      entity1 = entityManager.addKeys('group', {
        created: now + 1,
        displayName: displayName + '1',
        displayNameCanonical: normstr(displayName),
        groupId: nanoid(),
        otherId: nanoid(),
        updated: now + 1,
      });
    });

    it('created', function () {
      const pageKeys = {
        'group!': _.pick(entity0, ['entityPK', 'entitySK', 'created']),
      };

      console.log('pageKeys', pageKeys);

      const dehydrated = dehydratePageKeys(
        entityManager,
        'group',
        'created',
        'entityPK',
        pageKeys
      );

      console.log('dehydrated', dehydrated);

      const rehydrated = rehydratePageKeys(
        entityManager,
        'group',
        'created',
        'entityPK',
        dehydrated
      );

      expect(rehydrated).to.deep.equal(pageKeys);
    });

    it('displayName', function () {
      const pageKeys = {
        'group!': _.pick(entity0, [
          'entityPK',
          'entitySK',
          'displayNameCanonical',
        ]),
      };

      console.log('pageKeys', pageKeys);

      const dehydrated = dehydratePageKeys(
        entityManager,
        'group',
        'displayNameCanonical',
        'entityPK',
        pageKeys
      );

      console.log('dehydrated', dehydrated);

      const rehydrated = rehydratePageKeys(
        entityManager,
        'group',
        'displayNameCanonical',
        'entityPK',
        dehydrated
      );

      expect(rehydrated).to.deep.equal(pageKeys);
    });

    it('otherCreated', function () {
      const pageKeys0 = {
        'group!': _.pick(entity0, ['entityPK', 'entitySK', 'created']),
      };

      const pageKeys1 = {
        ['group!|otherId#' + entity1.otherId]: _.pick(entity1, [
          'entityPK',
          'entitySK',
          'otherPK',
          'created',
        ]),
      };

      console.log('pageKeys', [pageKeys0, pageKeys1]);

      const dehydrated = dehydratePageKeys(
        entityManager,
        'group',
        ['created', 'otherCreated'],
        ['entityPK', 'otherPK'],
        [pageKeys0, pageKeys1]
      );

      console.log('dehydrated', dehydrated);

      const rehydrated0 = rehydratePageKeys(
        entityManager,
        'group',
        'created',
        'entityPK',
        dehydrated
      );

      const rehydrated1 = rehydratePageKeys(
        entityManager,
        'group',
        'otherCreated',
        'otherPK',
        dehydrated
      );

      console.log('rehydrated', [rehydrated0, rehydrated1]);

      expect([rehydrated0, rehydrated1]).to.deep.equal([pageKeys0, pageKeys1]);
    });
  });
});
