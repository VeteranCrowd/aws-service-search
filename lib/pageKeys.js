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
 * @param {object} [logger] - Logger (defaults to console).
 * @return {string} Dehydrated page keys.
 */
export const dehydratePageKeys = (
  entityManager,
  entityToken,
  indexTokens,
  shardKeyTokens,
  pageKeys,
  logger = console
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

  const compressed = lzstring.compressToEncodedURIComponent(
    JSON.stringify(dehydrated)
  );

  logger.debug(
    '*** dehydratePageKeys ***',
    `entityToken: ${entityToken}`,
    `indexTokens: ${indexTokens}`,
    `shardKeyTokens: ${shardKeyTokens}`,
    'pageKeys',
    pageKeys,
    'dehydrated',
    dehydrated,
    `compressed: ${compressed}`
  );

  // Dehydrate page keys.
  return compressed;
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
 * @param {object} [logger] - Logger (defaults to console).
 * @return {string} Rehydrated page keys.
 */
export const rehydratePageKeys = (
  entityManager,
  entityToken,
  indexToken,
  shardKeyToken,
  pageKeys,
  logger = console
) => {
  if (_.isUndefined(pageKeys)) return undefined;
  if (pageKeys === '') return {};

  const decompressed = JSON.parse(
    lzstring.decompressFromEncodedURIComponent(pageKeys)
  );

  const rehydrated = _.mapKeys(
    _.mapValues(
      decompressed[_.join([indexToken, shardKeyToken], '~')],
      (pageKey) =>
        entityManager.rehydrateIndex(entityToken, indexToken, pageKey)
    ),
    (pageKey, shardKey) =>
      entityManager.rehydrateIndex(entityToken, [shardKeyToken], shardKey)[
        shardKeyToken
      ]
  );

  logger.debug(
    '*** rehydratePageKeys ***',
    `entityToken: ${entityToken}`,
    `indexToken: ${indexToken}`,
    `shardKeyToken: ${shardKeyToken}`,
    `pageKeys: ${pageKeys}`,
    'decompressed',
    decompressed,
    'rehydrated',
    rehydrated
  );

  return rehydrated;
};
