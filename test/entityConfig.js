import { sn2e, sn2u } from '@karmaniverous/tagged-templates';

export default {
  entities: {
    group: {
      indexes: {
        created: ['entityPK', 'entitySK', 'created'],
        displayNameCanonical: ['entityPK', 'entitySK', 'displayNameCanonical'],
        otherCreated: ['entityPK', 'entitySK', 'otherPK', 'created'],
        updated: ['entityPK', 'entitySK', 'updated'],
      },
      keys: {
        // Entity PK.
        entityPK: {
          encode: ({ entityToken = 'group', shardId }) =>
            `${entityToken}!${sn2e`${shardId}`}`,
          decode: (value) =>
            value.match(/^(?<entityToken>.*)!(?<shardId>.*)$/)?.groups,
        },

        // Other PK.
        otherPK: {
          encode: ({ entityToken = 'group', otherId, shardId }) =>
            sn2u`${entityToken}!${sn2e`${shardId}`}|otherId#${otherId}`,
          decode: (value) =>
            value.match(
              /^(?<entityToken>.*)!(?<shardId>.*)\|otherId#(?<otherId>.*)$/
            )?.groups,
        },

        // Entity SK.
        entitySK: {
          encode: ({ groupId }) => sn2u`groupId#${groupId}`,
          decode: (value) => value.match(/^groupId#(?<groupId>.*)$/)?.groups,
        },

        // Group created SK.
        created: {
          encode: ({ created }) => Number(created),
          decode: (value) => ({ created: value.toString() }),
          retain: true,
        },

        // Group displayName SK.
        displayNameCanonical: {
          encode: ({ displayNameCanonical }) => displayNameCanonical,
          decode: (value) => ({ displayNameCanonical: value }),
          retain: true,
        },

        // Group updated SK.
        updated: {
          encode: ({ updated }) => Number(updated),
          decode: (value) => ({ updated: value.toString() }),
          retain: true,
        },
      },
      sharding: {
        entityKey: ({ groupId }) => groupId,
        timestamp: ({ created }) => created,
      },
    },
  },
  shardKeyToken: 'shardId',
};
