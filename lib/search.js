// npm imports
import { EntityManager } from '@karmaniverous/entity-manager';
import { WrappedDynamoDbClient } from '@veterancrowd/wrapped-dynamodb-client';
import { boolean, isBooleanable } from 'boolean';
import createError from 'http-errors';
import _ from 'lodash';

/**
 * Add filter condition to DynamoDB query objects.
 * @function
 * @param {object} options - config object
 * @param {string} options.attributeName - The name of the attribute to filter on.
 * @param {string} options.attributeValue - The beginning value of the attribute to filter on.
 * @param {object} options.expressionAttributeNames - The expression attribute names object to add the attribute name to.
 * @param {object} options.expressionAttributeValues - The expression attribute values object to add the attribute value to.
 * @param {string[]} options.filterConditions - The filter conditions array to add the filter condition to.
 * @param {boolean} [options.negate] - Whether to negate the filter condition.
 * @param {string} options.operator - The operator to use for the filter condition.
 * @return {undefined}
 */
export const addFilterCondition = ({
  attributeName,
  attributeValue,
  expressionAttributeNames = {},
  expressionAttributeValues = {},
  filterConditions = [],
  negate = false,
  operator,
}) => {
  expressionAttributeNames[`#${attributeName}`] = attributeName;

  if (operator === 'in') {
    if (!_.isArray(attributeValue))
      throw createError.BadRequest(
        `'${attributeName}' attributeValue value must be an array when using the 'in' operator`
      );

    if (!attributeValue.length) return;

    for (const value of attributeValue)
      expressionAttributeValues[
        `:${attributeName}_${value.toString().replace(/[.-]/g, '')}`
      ] = value;
  } else expressionAttributeValues[`:${attributeName}`] = attributeValue;

  filterConditions.push(
    `${negate ? 'not ' : ''}${
      operator === 'in'
        ? `#${attributeName} ${operator} (${attributeValue.map(
            (value) =>
              `:${attributeName}_${value.toString().replace(/[.-]/g, '')}`
          )})`
        : ['begins_with', 'contains'].includes(operator)
        ? `${operator}(#${attributeName}, :${attributeName})`
        : `#${attributeName} ${operator} :${attributeName}`
    }`
  );
};

/**
 * Add exists filter condition to DynamoDB query objects.
 * @function
 * @param {object} options - config object
 * @param {string} options.attributeName - The name of the attribute to filter on.
 * @param {boolean} [options.exists] - The value indicating whether the attribute should exist or not.
 * @param {object} options.expressionAttributeNames - The expression attribute names object to add the attribute name to.
 * @param {string[]} options.filterConditions - The filter conditions array to add the filter condition to.
 * @return {undefined}
 */
export const addFilterConditionExists = ({
  attributeName,
  exists,
  expressionAttributeNames = {},
  filterConditions = [],
}) => {
  if (_.isUndefined(exists)) return;
  expressionAttributeNames[`#${attributeName}`] = attributeName;
  filterConditions.push(
    `attribute${exists ? '' : '_not'}_exists(#${attributeName})`
  );
};

/**
 * Add range filter condition to DynamoDB query objects.
 * @function
 * @param {object} options - config object
 * @param {string} options.attributeName - The name of the attribute to filter on.
 * @param {string} [options.attributeValueFrom] - The beginning value of the attribute to filter on.
 * @param {string} [options.attributeValueTo] - The ending value of the attribute to filter on.
 * @param {object} options.expressionAttributeNames - The expression attribute names object to add the attribute name to.
 * @param {object} options.expressionAttributeValues - The expression attribute values object to add the attribute value to.
 * @param {string[]} options.filterConditions - The filter conditions array to add the filter condition to.
 * @param {boolean} [options.negate] - Whether to negate the filter condition.
 * @return {undefined}
 */
export const addFilterConditionRange = ({
  attributeName,
  attributeValueFrom,
  attributeValueTo,
  expressionAttributeNames = {},
  expressionAttributeValues = {},
  filterConditions = [],
  negate = false,
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
      `${
        negate ? 'not ' : ''
      }#${attributeName} BETWEEN :${attributeName}From AND :${attributeName}To`
    );
};

/**
 * Get a shard query function for use with Entity Manager query function.
 * @function
 * @param {object} options - config object
 * @param {WrappedDynamoDbClient} options.dbClient - The Wrapped DynamoDB client.
 * @param {object} [options.expressionAttributeNames] - The expression attribute names object.
 * @param {object} [options.expressionAttributeValues] - The expression attribute values object.
 * @param {string[]} [options.filterConditions] - The filter conditions array.
 * @param {string} [options.indexName] - The name of the index to query.
 * @param {string} options.partitionKeyName - The name of the partition key.
 * @param {boolean} [options.scanIndexForward] - Whether to scan the index forward.
 * @param {string} [options.sortKeyCondition] - The sort key condition.
 * @return {Function} The shard query function.
 */
export const getShardQuery =
  ({
    dbClient,
    expressionAttributeNames = {},
    expressionAttributeValues = {},
    filterConditions = [],
    indexName,
    partitionKeyName,
    scanIndexForward = true,
    sortKeyCondition,
  }) =>
  async (partitionKeyValue, pageKey, limit) => {
    const {
      Count: count,
      Items: items,
      LastEvaluatedKey: newPageKey,
    } = await dbClient.query(process.env.TABLE_NAME, {
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

/**
 * Get a sort key condition for a DynamoDB query & update query objects.
 * @function
 * @param {object} options - config object
 * @param {EntityManager} options.entityManager - The entity manager.
 * @param {string} options.entityToken - The entity token.
 * @param {object} options.expressionAttributeNames - The expression attribute names object to add the attribute name to.
 * @param {object} options.expressionAttributeValues - The expression attribute values object to add the attribute value to.
 * @param {object} options.item - An item containing enough data to generate the partial sort key.
 * @param {string} options.operator - The sort key operator.
 * @param {string} options.sortKeyName - The name of the sort key.
 * @return {string|undefined} The sort key condition.
 */
export const getSortKeyCondition = ({
  entityManager,
  entityToken,
  expressionAttributeNames = {},
  expressionAttributeValues = {},
  item,
  operator,
  sortKeyName,
}) => {
  const key = entityManager.getKey(entityToken, sortKeyName);

  const sortKeyValue = _.has(item, sortKeyName)
    ? item[sortKeyName]
    : key?.encode(item);

  if (_.isUndefined(sortKeyValue)) return;

  expressionAttributeNames[`#${sortKeyName}`] = sortKeyName;
  expressionAttributeValues[`:${sortKeyName}`] = sortKeyValue;

  return ['begins_with'].includes(operator)
    ? `${operator}(#${sortKeyName}, :${sortKeyName})`
    : `#${sortKeyName} ${operator} :${sortKeyName}`;
};

/**
 * Get a range sort key condition for a DynamoDB query & update query objects.
 * @function
 * @param {object} options - config object
 * @param {EntityManager} options.entityManager - The entity manager.
 * @param {string} options.entityToken - The entity token.
 * @param {object} options.expressionAttributeNames - The expression attribute names object to add the attribute name to.
 * @param {object} options.expressionAttributeValues - The expression attribute values object to add the attribute value to.
 * @param {object} options.itemFrom - An item containing enough data to generate the 'from' sort key.
 * @param {object} options.itemTo - An item containing enough data to generate the 'to' sort key.
 * @param {string} options.sortKeyName - The name of the sort key.
 * @return {string|undefined} The sort key condition.
 */
export const getSortKeyConditionRange = ({
  entityManager,
  entityToken,
  expressionAttributeNames = {},
  expressionAttributeValues = {},
  itemFrom,
  itemTo,
  sortKeyName,
}) => {
  const key = entityManager.getKey(entityToken, sortKeyName);

  const sortKeyValueFrom = _.has(itemFrom, sortKeyName)
    ? itemFrom[sortKeyName]
    : key?.encode(itemFrom);

  const sortKeyValueTo = _.has(itemTo, sortKeyName)
    ? itemTo[sortKeyName]
    : key?.encode(itemTo);

  if (_.isUndefined(sortKeyValueTo) && _.isUndefined(sortKeyValueFrom)) return;

  expressionAttributeNames[`#${sortKeyName}`] = sortKeyName;

  if (sortKeyValueFrom)
    expressionAttributeValues[`:${sortKeyName}From`] = sortKeyValueFrom;

  if (sortKeyValueTo)
    expressionAttributeValues[`:${sortKeyName}To`] = sortKeyValueTo;

  return sortKeyValueFrom && !sortKeyValueTo
    ? `#${sortKeyName} >= :${sortKeyName}From`
    : !sortKeyValueFrom && sortKeyValueTo
    ? `#${sortKeyName} <= :${sortKeyName}To`
    : `#${sortKeyName} BETWEEN :${sortKeyName}From AND :${sortKeyName}To`;
};

/**
 * Parse a string query parameter into a boolean value.
 * @function
 * @param {string} param - The query parameter to parse.
 * @param {string} token - The name of the query parameter.
 * @return {boolean|undefined} The parsed boolean value.
 */
export const parseBooleanQueryParam = (param, token) => {
  if (_.isUndefined(param)) return undefined;

  if (!isBooleanable(param))
    throw new createError.BadRequest(
      `unable to parse '${token}' query parameter value '${param}' to boolean value`
    );

  return boolean(param);
};

/**
 * Parse a delimited string query parameter into an array, optionally against an enumeration.
 * @function
 * @param {string} param - The query parameter to parse.
 * @param {string} token - The name of the query parameter.
 * @param {object} [enumeration] - The enumeration to parse against.
 * @param {string} [delimiter] - The delimiter to split the string on.
 * @return {string[]} The parsed string array.
 */
export const parseDelimitedQueryParam = (
  param,
  token,
  enumeration,
  delimiter = '~'
) => {
  if (_.isUndefined(param)) return undefined;

  const values = param.split(delimiter);

  if (enumeration) {
    if (!_.isPlainObject(enumeration))
      throw new Error('enumeration must be a plain object');

    if (_.intersection(values, _.values(enumeration)).length !== values.length)
      throw new createError.BadRequest(
        `${token} contains values not supported by enumeration`
      );
  }

  return values;
};

/**
 * Parse a string query parameter into a number value.
 * @function
 * @param {string} param - The query parameter to parse.
 * @param {string} token - The name of the query parameter.
 * @return {number|undefined} The parsed number value.
 */
export const parseNumberQueryParam = (param, token) => {
  if (_.isUndefined(param)) return undefined;

  const value = _.toNumber(param);

  if (_.isNaN(value))
    throw new createError.BadRequest(
      `unable to parse '${token}' query parameter value '${param}' to number value`
    );

  return value;
};

/**
 * Parse a string query parameter into a whole number value.
 * @function
 * @param {string} param - The query parameter to parse.
 * @param {string} token - The name of the query parameter.
 * @return {number|undefined} The parsed whole number value.
 */
export const parseWholeNumberQueryParam = (param, token) => {
  if (_.isUndefined(param)) return undefined;

  const value = _.toNumber(param);

  if (!_.isInteger(value) || value < 0)
    throw new createError.BadRequest(
      `unable to parse '${token}' query parameter value '${param}' to whole number value`
    );

  return value;
};
