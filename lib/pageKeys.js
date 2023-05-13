// npm imports
import { EntityManager } from '@karmaniverous/entity-manager';
import _ from 'lodash';
import lzstring from 'lz-string';

/**
 * Dehydrate a shard-keyed map of page keys into a compressed string.
 * @function
 * @param {EntityManager} entityManager - EntityManager instance.
 * @param {string} entityToken - Entity token.
 * @param {string} indexToken - Index token or array of key tokens.
 * @param {string} shardKeyToken - Shard key token.
 * @param {object} pageKeys - Rehydrated page keys.
 * @return {string} Dehydrated page keys.
 */
export const dehydratePageKeys = (
  entityManager,
  entityToken,
  indexToken,
  shardKeyToken,
  pageKeys
) =>
  _.size(pageKeys)
    ? lzstring.compressToEncodedURIComponent(
        JSON.stringify(
          _.mapKeys(
            _.mapValues(pageKeys, (pageKey) =>
              entityManager.dehydrateIndex(entityToken, indexToken, pageKey)
            ),
            (pageKey, shardKey) =>
              entityManager.dehydrateIndex(entityToken, [shardKeyToken], {
                [shardKeyToken]: shardKey,
              })
          )
        )
      )
    : '';

/**
 * Rehydrate a compressed string into a shard-keyed map of page keys.
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
    : _.mapKeys(
        _.mapValues(
          JSON.parse(
            lzstring.decompressFromEncodedURIComponent(
              pageKeys === '' ? 'N4XyA' : pageKeys
            )
          ),
          (pageKey) =>
            entityManager.rehydrateIndex(entityToken, indexToken, pageKey)
        ),
        (pageKey, shardKey) =>
          entityManager.rehydrateIndex(entityToken, [shardKeyToken], shardKey)[
            shardKeyToken
          ]
      );
