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

export const rangeKeyConditionBeginsWith = ({
  entityManager,
  entityToken,
  expressionAttributeNames = {},
  expressionAttributeValues = {},
  item,
  keyToken,
}) => {
  const { encode } = entityManager.getKey(entityToken, keyToken);

  const keyValue = encode(item);

  if (!keyValue) throw createError.BadRequest('invalid key value');

  expressionAttributeNames[`#${keyToken}`] = keyToken;
  expressionAttributeValues[`:${keyToken}`] = keyValue;

  return `begins_with(#${keyToken}, :${keyToken})`;
};

export const rangeKeyConditionRange = ({
  entityManager,
  entityToken,
  expressionAttributeNames = {},
  expressionAttributeValues = {},
  itemFrom,
  itemTo,
  keyToken,
}) => {
  const { encode } = entityManager.getKey(entityToken, keyToken);

  const keyValueFrom = encode(itemFrom);
  const keyValueTo = encode(itemTo);

  if (!keyValueFrom && !keyValueTo) return;

  expressionAttributeNames[`#${keyToken}`] = keyToken;

  if (keyValueFrom)
    expressionAttributeValues[`:${keyToken}From`] = keyValueFrom;

  if (keyValueTo) expressionAttributeValues[`:${keyToken}To`] = keyValueTo;

  if (keyValueFrom && !keyValueTo) return `#${keyToken} >= :${keyToken}From`;
  else if (!keyValueFrom && keyValueTo) return `#${keyToken} <= :${keyToken}To`;
  else return `#${keyToken} BETWEEN :${keyToken}From AND :${keyToken}To`;
};

export const getShardQuery =
  ({
    dbClient,
    expressionAttributeNames = {},
    expressionAttributeValues = {},
    filterConditions = [],
    indexName,
    keyToken,
    rangeKeyCondition,
    scanIndexForward,
  }) =>
  async (keyValue, pageKey, limit) => {
    const {
      Count: count,
      Items: items,
      LastEvaluatedKey: newPageKey,
    } = await dbClient.query(process.env.STACK_NAME, {
      ExclusiveStartKey: pageKey,
      IndexName: indexName,
      KeyConditionExpression: `#PK = :PK${
        rangeKeyCondition ? ` AND ${rangeKeyCondition}` : ''
      }`,
      ExpressionAttributeNames: {
        '#PK': keyToken,
        ...expressionAttributeNames,
      },
      ExpressionAttributeValues: {
        ':PK': keyValue,
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
