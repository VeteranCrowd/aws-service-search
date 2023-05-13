// npm imports
import { boolean, isBooleanable } from 'boolean';
import createError from 'http-errors';
import _ from 'lodash';

export const parseBooleanParam = (param, token) => {
  if (!_.isUndefined(param)) {
    if (!isBooleanable(param))
      throw new createError.BadRequest(`Invalid ${token}`);
    return boolean(param);
  }
};

export const parseWholeNumberParam = (param, token) => {
  const value = _.isUndefined(param) ? undefined : Number(param);

  if (!_.isUndefined(value)) {
    if (!_.isInteger(value) || value < 0)
      throw new createError.BadRequest(`Invalid ${token}`);
    return value;
  }
};

export const addFilterConditionBeginsWith = ({
  attributeName,
  attributeValue,
  expressionAttributeNames = {},
  expressionAttributeValues = {},
  filterConditions = [],
}) => {
  expressionAttributeNames[`#${attributeName}`] = attributeName;
  expressionAttributeValues[`:${attributeName}`] = attributeValue;
  filterConditions.push(`begins_with(#${attributeName}, :${attributeName})`);
};

export const addFilterConditionExists = ({
  attributeName,
  exists,
  expressionAttributeNames = {},
  filterConditions = [],
}) => {
  expressionAttributeNames[`#${attributeName}`] = attributeName;
  filterConditions.push(
    `attribute${exists ? '' : '_not'}_exists(#${attributeName})`
  );
};

export const addFilterConditionRange = ({
  attributeName,
  attributeValueFrom,
  attributeValueTo,
  expressionAttributeNames = {},
  expressionAttributeValues = {},
  filterConditions = [],
}) => {
  expressionAttributeNames[`#${attributeName}`] = attributeName;

  if (attributeValueFrom)
    expressionAttributeValues[`:${attributeName}From`] = attributeValueFrom;

  if (attributeValueTo)
    expressionAttributeValues[`:${attributeName}To`] = attributeValueTo;

  if (attributeValueFrom && !attributeValueTo)
    filterConditions.push(`#${attributeName} >= :${attributeName}From`);
  else if (!attributeValueFrom && attributeValueTo)
    filterConditions.push(`#${attributeName} <= :${attributeName}To`);
  else
    filterConditions.push(
      `#${attributeName} BETWEEN :${attributeName}From AND :${attributeName}To`
    );
};

export const sortKeyConditionBeginsWith = ({
  entityManager,
  entityToken,
  expressionAttributeNames = {},
  expressionAttributeValues = {},
  item,
  sortKeyName,
}) => {
  const { encode } = entityManager.getKey(entityToken, sortKeyName);

  const sortKeyValue = encode(item);

  if (!sortKeyValue) throw createError.BadRequest('invalid key value');

  expressionAttributeNames[`#${sortKeyName}`] = sortKeyName;
  expressionAttributeValues[`:${sortKeyName}`] = sortKeyValue;

  return `begins_with(#${sortKeyName}, :${sortKeyName})`;
};

export const sortKeyConditionRange = ({
  entityManager,
  entityToken,
  expressionAttributeNames = {},
  expressionAttributeValues = {},
  itemFrom,
  itemTo,
  sortKeyName,
}) => {
  const { encode } = entityManager.getKey(entityToken, sortKeyName);

  const sortKeyValueFrom = encode(itemFrom);
  const sortKeyValueTo = encode(itemTo);

  if (!sortKeyValueFrom && !sortKeyValueTo) return;

  expressionAttributeNames[`#${sortKeyName}`] = sortKeyName;

  if (sortKeyValueFrom)
    expressionAttributeValues[`:${sortKeyName}From`] = sortKeyValueFrom;

  if (sortKeyValueTo) expressionAttributeValues[`:${sortKeyName}To`] = sortKeyValueTo;

  if (sortKeyValueFrom && !sortKeyValueTo) return `#${sortKeyName} >= :${sortKeyName}From`;
  else if (!sortKeyValueFrom && sortKeyValueTo) return `#${sortKeyName} <= :${sortKeyName}To`;
  else return `#${sortKeyName} BETWEEN :${sortKeyName}From AND :${sortKeyName}To`;
};

export const getShardQuery =
  ({
    dbClient,
    expressionAttributeNames = {},
    expressionAttributeValues = {},
    filterConditions = [],
    indexName,
    partitionKeyName,
    scanIndexForward,
    sortKeyCondition,
  }) =>
  async (partitionKeyValue, pageKey, limit) => {
    const {
      Count: count,
      Items: items,
      LastEvaluatedKey: newPageKey,
    } = await dbClient.query(process.env.STACK_NAME, {
      ExclusiveStartKey: pageKey,
      IndexName: indexName,
      KeyConditionExpression: `#PK = :PK${
        sortKeyCondition ? ` AND ${sortKeyCondition}` : ''
      }`,
      ExpressionAttributeNames: {
        '#PK': partitionKeyName,
        ...expressionAttributeNames,
      },
      ExpressionAttributeValues: {
        ':PK': partitionKeyValue,
        ...expressionAttributeValues,
      },
      ...(filterConditions.length
        ? { FilterExpression: filterConditions.join(' AND ') }
        : {}),
      ...(_.isUndefined(limit) ? {} : { Limit: limit }),
      ScanIndexForward: scanIndexForward,
    });

    return { count, items, pageKey: newPageKey };
  };
