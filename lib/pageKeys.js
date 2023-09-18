// npm imports
import { EntityManager } from '@karmaniverous/entity-manager';
import _ from 'lodash';
import lzstring from 'lz-string';

/**
 * Dehydrate a shard-keyed map of page keys into a compressed string. Supports multiple paged queries on different indexes.
 * In this case, present indexTokens, shardKeyTokens, and pageKeys as arrays of the same length. If all pageKeys entries are
 * empty objects, returns an empty string.
 * @function
 * @param {EntityManager} entityManager - EntityManager instance.
 * @param {string} entityToken - Entity token.
 * @param {string[]} indexTokens - Index token or array of key tokens. May be an array of same, of the same length as pageKeys.
 * @param {string|string[]} shardKeyTokens - Shard key token. May be an array of same, of the same length as pageKeys.
 * @param {object|object[]} pageKeys - Rehydrated page keys. May be an array of same.
 * @return {string} Dehydrated page keys.
 */
export const dehydratePageKeys = (
  entityManager,
  entityToken,
  indexTokens,
  shardKeyTokens,
  pageKeys
) => {
  // Validate params.
  indexTokens = _.castArray(indexTokens);
  shardKeyTokens = _.castArray(shardKeyTokens);
  pageKeys = _.castArray(pageKeys);

  if (
    _.size(indexTokens) !== _.size(pageKeys) ||
    _.size(shardKeyTokens) !== _.size(pageKeys)
  )
    throw new Error(
      'indexTokens, shardKeyTokens, and pageKeys must be the same length.'
    );

  // If all pageKeys entries are empty objects, return an empty string.
  if (_.every(pageKeys, _.isEmpty)) return '';

  const dehydrated = _.zipObject(
    _.zipWith(indexTokens, shardKeyTokens, (...tokens) => _.join(tokens, '~')),
    pageKeys.map((pk, i) =>
      _.mapKeys(
        _.mapValues(pk, (pageKey) =>
          entityManager.dehydrateIndex(entityToken, indexTokens[i], pageKey)
        ),
        (pageKey, shardKey) =>
          entityManager.dehydrateIndex(entityToken, [shardKeyTokens[i]], {
            [shardKeyTokens[i]]: shardKey,
          })
      )
    )
  );

  console.debug('dehydrated', dehydrated);

  // Dehydrate page keys.
  return lzstring.compressToEncodedURIComponent(JSON.stringify(dehydrated));
};

/**
 * Rehydrate a single shardKeyToken's shard-keyed map of page keys from a dehydrated map, possibly representing
 * multiple shardKeyTokens.
 * @function
 * @param {EntityManager} entityManager - EntityManager instance.
 * @param {string} entityToken - Entity token.
 * @param {string} indexToken - Index token or array of key tokens.
 * @param {string} shardKeyToken - Shard key token.
 * @param {object} pageKeys - Dehydrated page keys.
 * @return {string} Rehydrated page keys.
 */
export const rehydratePageKeys = (
  entityManager,
  entityToken,
  indexToken,
  shardKeyToken,
  pageKeys
) =>
  _.isUndefined(pageKeys)
    ? undefined
    : pageKeys === ''
    ? {}
    : _.mapKeys(
        _.mapValues(
          JSON.parse(lzstring.decompressFromEncodedURIComponent(pageKeys))[
            _.join([indexToken, shardKeyToken], '~')
          ],
          (pageKey) =>
            entityManager.rehydrateIndex(entityToken, indexToken, pageKey)
        ),
        (pageKey, shardKey) =>
          entityManager.rehydrateIndex(entityToken, [shardKeyToken], shardKey)[
            shardKeyToken
          ]
      );
