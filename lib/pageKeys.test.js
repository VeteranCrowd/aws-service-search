/* eslint-env mocha */

// npm imports
import { normstr } from '@karmaniverous/tagged-templates';
import { expect } from 'chai';
import _ from 'lodash';
import { nanoid } from 'nanoid';

// Configure entity manager.
import { EntityManager } from '@karmaniverous/entity-manager';
import entityConfig from '../test/entityConfig.js';
const entityManager = new EntityManager({ config: entityConfig });

// text imports
import { dehydratePageKeys, rehydratePageKeys } from './pageKeys.js';

describe('pageKeys', function () {
  describe('dehydrate - rehydrate', function () {
    const displayName = 'Test Group';
    let now;
    let entity;

    beforeEach(function () {
      now = Date.now();
      entity = entityManager.addKeys('group', {
        created: now,
        displayName,
        displayNameCanonical: normstr(displayName),
        groupId: nanoid(),
        updated: now,
      });
    });

    it('created', function () {
      const pageKeys = {
        'group!': _.pick(entity, ['entityPK', 'entitySK', 'created']),
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
        'group!': _.pick(entity, ['entityPK', 'entitySK', 'created']),
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
  });
});
