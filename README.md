# aws-service-search

AWS service search utilities.

# API Documentation

## Functions

<dl>
<dt><a href="#dehydratePageKeys">dehydratePageKeys(entityManager, entityToken, indexTokens, shardKeyTokens, pageKeys, [logger])</a> ⇒ <code>string</code></dt>
<dd><p>Dehydrate a shard-keyed map of page keys into a compressed string. Supports multiple paged queries on different indexes.
In this case, present indexTokens, shardKeyTokens, and pageKeys as arrays of the same length. If all pageKeys entries are
empty objects, returns an empty string.</p>
</dd>
<dt><a href="#rehydratePageKeys">rehydratePageKeys(entityManager, entityToken, indexToken, shardKeyToken, pageKeys, [logger])</a> ⇒ <code>string</code></dt>
<dd><p>Rehydrate a single shardKeyToken&#39;s shard-keyed map of page keys from a dehydrated map, possibly representing
multiple shardKeyTokens.</p>
</dd>
<dt><a href="#addFilterCondition">addFilterCondition(options)</a> ⇒ <code>undefined</code></dt>
<dd><p>Add filter condition to DynamoDB query objects.</p>
</dd>
<dt><a href="#addFilterConditionExists">addFilterConditionExists(options)</a> ⇒ <code>undefined</code></dt>
<dd><p>Add exists filter condition to DynamoDB query objects.</p>
</dd>
<dt><a href="#addFilterConditionRange">addFilterConditionRange(options)</a> ⇒ <code>undefined</code></dt>
<dd><p>Add range filter condition to DynamoDB query objects.</p>
</dd>
<dt><a href="#getShardQuery">getShardQuery(options)</a> ⇒ <code>function</code></dt>
<dd><p>Get a shard query function for use with Entity Manager query function.</p>
</dd>
<dt><a href="#getSortKeyCondition">getSortKeyCondition(options)</a> ⇒ <code>string</code> | <code>undefined</code></dt>
<dd><p>Get a sort key condition for a DynamoDB query &amp; update query objects.</p>
</dd>
<dt><a href="#getSortKeyConditionRange">getSortKeyConditionRange(options)</a> ⇒ <code>string</code> | <code>undefined</code></dt>
<dd><p>Get a range sort key condition for a DynamoDB query &amp; update query objects.</p>
</dd>
<dt><a href="#parseBooleanQueryParam">parseBooleanQueryParam(param, token)</a> ⇒ <code>boolean</code> | <code>undefined</code></dt>
<dd><p>Parse a string query parameter into a boolean value.</p>
</dd>
<dt><a href="#parseDelimitedQueryParam">parseDelimitedQueryParam(param, token, [enumeration], [delimiter])</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>Parse a delimited string query parameter into an array, optionally against an enumeration.</p>
</dd>
<dt><a href="#parseWholeNumberQueryParam">parseWholeNumberQueryParam(param, token)</a> ⇒ <code>number</code> | <code>undefined</code></dt>
<dd><p>Parse a string query parameter into a whole number value.</p>
</dd>
</dl>

<a name="dehydratePageKeys"></a>

## dehydratePageKeys(entityManager, entityToken, indexTokens, shardKeyTokens, pageKeys, [logger]) ⇒ <code>string</code>
Dehydrate a shard-keyed map of page keys into a compressed string. Supports multiple paged queries on different indexes.In this case, present indexTokens, shardKeyTokens, and pageKeys as arrays of the same length. If all pageKeys entries areempty objects, returns an empty string.

**Kind**: global function  
**Returns**: <code>string</code> - Dehydrated page keys.  

| Param | Type | Description |
| --- | --- | --- |
| entityManager | <code>EntityManager</code> | EntityManager instance. |
| entityToken | <code>string</code> | Entity token. |
| indexTokens | <code>Array.&lt;string&gt;</code> | Index token or array of key tokens. May be an array of same, of the same length as pageKeys. |
| shardKeyTokens | <code>string</code> \| <code>Array.&lt;string&gt;</code> | Shard key token. May be an array of same, of the same length as pageKeys. |
| pageKeys | <code>object</code> \| <code>Array.&lt;object&gt;</code> | Rehydrated page keys. May be an array of same. |
| [logger] | <code>object</code> | Logger (defaults to console). |

<a name="rehydratePageKeys"></a>

## rehydratePageKeys(entityManager, entityToken, indexToken, shardKeyToken, pageKeys, [logger]) ⇒ <code>string</code>
Rehydrate a single shardKeyToken's shard-keyed map of page keys from a dehydrated map, possibly representingmultiple shardKeyTokens.

**Kind**: global function  
**Returns**: <code>string</code> - Rehydrated page keys.  

| Param | Type | Description |
| --- | --- | --- |
| entityManager | <code>EntityManager</code> | EntityManager instance. |
| entityToken | <code>string</code> | Entity token. |
| indexToken | <code>string</code> | Index token or array of key tokens. |
| shardKeyToken | <code>string</code> | Shard key token. |
| pageKeys | <code>object</code> | Dehydrated page keys. |
| [logger] | <code>object</code> | Logger (defaults to console). |

<a name="addFilterCondition"></a>

## addFilterCondition(options) ⇒ <code>undefined</code>
Add filter condition to DynamoDB query objects.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | config object |
| options.attributeName | <code>string</code> | The name of the attribute to filter on. |
| options.attributeValue | <code>string</code> | The beginning value of the attribute to filter on. |
| options.expressionAttributeNames | <code>object</code> | The expression attribute names object to add the attribute name to. |
| options.expressionAttributeValues | <code>object</code> | The expression attribute values object to add the attribute value to. |
| options.filterConditions | <code>Array.&lt;string&gt;</code> | The filter conditions array to add the filter condition to. |
| [options.negate] | <code>boolean</code> | Whether to negate the filter condition. |
| options.operator | <code>string</code> | The operator to use for the filter condition. |

<a name="addFilterConditionExists"></a>

## addFilterConditionExists(options) ⇒ <code>undefined</code>
Add exists filter condition to DynamoDB query objects.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | config object |
| options.attributeName | <code>string</code> | The name of the attribute to filter on. |
| [options.exists] | <code>boolean</code> | The value indicating whether the attribute should exist or not. |
| options.expressionAttributeNames | <code>object</code> | The expression attribute names object to add the attribute name to. |
| options.filterConditions | <code>Array.&lt;string&gt;</code> | The filter conditions array to add the filter condition to. |

<a name="addFilterConditionRange"></a>

## addFilterConditionRange(options) ⇒ <code>undefined</code>
Add range filter condition to DynamoDB query objects.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | config object |
| options.attributeName | <code>string</code> | The name of the attribute to filter on. |
| [options.attributeValueFrom] | <code>string</code> | The beginning value of the attribute to filter on. |
| [options.attributeValueTo] | <code>string</code> | The ending value of the attribute to filter on. |
| options.expressionAttributeNames | <code>object</code> | The expression attribute names object to add the attribute name to. |
| options.expressionAttributeValues | <code>object</code> | The expression attribute values object to add the attribute value to. |
| options.filterConditions | <code>Array.&lt;string&gt;</code> | The filter conditions array to add the filter condition to. |
| [options.negate] | <code>boolean</code> | Whether to negate the filter condition. |

<a name="getShardQuery"></a>

## getShardQuery(options) ⇒ <code>function</code>
Get a shard query function for use with Entity Manager query function.

**Kind**: global function  
**Returns**: <code>function</code> - The shard query function.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | config object |
| options.dbClient | <code>WrappedDynamoDbClient</code> | The Wrapped DynamoDB client. |
| [options.expressionAttributeNames] | <code>object</code> | The expression attribute names object. |
| [options.expressionAttributeValues] | <code>object</code> | The expression attribute values object. |
| [options.filterConditions] | <code>Array.&lt;string&gt;</code> | The filter conditions array. |
| [options.indexName] | <code>string</code> | The name of the index to query. |
| options.partitionKeyName | <code>string</code> | The name of the partition key. |
| [options.scanIndexForward] | <code>boolean</code> | Whether to scan the index forward. |
| [options.sortKeyCondition] | <code>string</code> | The sort key condition. |

<a name="getSortKeyCondition"></a>

## getSortKeyCondition(options) ⇒ <code>string</code> \| <code>undefined</code>
Get a sort key condition for a DynamoDB query & update query objects.

**Kind**: global function  
**Returns**: <code>string</code> \| <code>undefined</code> - The sort key condition.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | config object |
| options.entityManager | <code>EntityManager</code> | The entity manager. |
| options.entityToken | <code>string</code> | The entity token. |
| options.expressionAttributeNames | <code>object</code> | The expression attribute names object to add the attribute name to. |
| options.expressionAttributeValues | <code>object</code> | The expression attribute values object to add the attribute value to. |
| options.item | <code>object</code> | An item containing enough data to generate the partial sort key. |
| options.operator | <code>string</code> | The sort key operator. |
| options.sortKeyName | <code>string</code> | The name of the sort key. |

<a name="getSortKeyConditionRange"></a>

## getSortKeyConditionRange(options) ⇒ <code>string</code> \| <code>undefined</code>
Get a range sort key condition for a DynamoDB query & update query objects.

**Kind**: global function  
**Returns**: <code>string</code> \| <code>undefined</code> - The sort key condition.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | config object |
| options.entityManager | <code>EntityManager</code> | The entity manager. |
| options.entityToken | <code>string</code> | The entity token. |
| options.expressionAttributeNames | <code>object</code> | The expression attribute names object to add the attribute name to. |
| options.expressionAttributeValues | <code>object</code> | The expression attribute values object to add the attribute value to. |
| options.itemFrom | <code>object</code> | An item containing enough data to generate the 'from' sort key. |
| options.itemTo | <code>object</code> | An item containing enough data to generate the 'to' sort key. |
| options.sortKeyName | <code>string</code> | The name of the sort key. |

<a name="parseBooleanQueryParam"></a>

## parseBooleanQueryParam(param, token) ⇒ <code>boolean</code> \| <code>undefined</code>
Parse a string query parameter into a boolean value.

**Kind**: global function  
**Returns**: <code>boolean</code> \| <code>undefined</code> - The parsed boolean value.  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>string</code> | The query parameter to parse. |
| token | <code>string</code> | The name of the query parameter. |

<a name="parseDelimitedQueryParam"></a>

## parseDelimitedQueryParam(param, token, [enumeration], [delimiter]) ⇒ <code>Array.&lt;string&gt;</code>
Parse a delimited string query parameter into an array, optionally against an enumeration.

**Kind**: global function  
**Returns**: <code>Array.&lt;string&gt;</code> - The parsed string array.  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>string</code> | The query parameter to parse. |
| token | <code>string</code> | The name of the query parameter. |
| [enumeration] | <code>object</code> | The enumeration to parse against. |
| [delimiter] | <code>string</code> | The delimiter to split the string on. |

<a name="parseWholeNumberQueryParam"></a>

## parseWholeNumberQueryParam(param, token) ⇒ <code>number</code> \| <code>undefined</code>
Parse a string query parameter into a whole number value.

**Kind**: global function  
**Returns**: <code>number</code> \| <code>undefined</code> - The parsed whole number value.  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>string</code> | The query parameter to parse. |
| token | <code>string</code> | The name of the query parameter. |


---

See more great templates and other tools on
[my GitHub Profile](https://github.com/karmaniverous)!
