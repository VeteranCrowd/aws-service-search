# aws-service-search

AWS service search utilities.

# API Documentation

## Functions

<dl>
<dt><a href="#addFilterConditionBeginsWith">addFilterConditionBeginsWith(options)</a> ⇒ <code>undefined</code></dt>
<dd><p>Add begins_with filter condition to DynamoDB query objects.</p>
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
<dt><a href="#parseBooleanQueryParam">parseBooleanQueryParam(param, token)</a> ⇒ <code>boolean</code> | <code>undefined</code></dt>
<dd><p>Parse a string query parameter into a boolean value.</p>
</dd>
<dt><a href="#parseWholeNumberQueryParam">parseWholeNumberQueryParam(param, token)</a> ⇒ <code>number</code> | <code>undefined</code></dt>
<dd><p>Parse a string query parameter into a whole number value.</p>
</dd>
<dt><a href="#sortKeyConditionBeginsWith">sortKeyConditionBeginsWith(options)</a> ⇒ <code>string</code> | <code>undefined</code></dt>
<dd><p>Get a begins_with sort key condition for a DynamoDB query &amp; update query objects.</p>
</dd>
<dt><a href="#sortKeyConditionRange">sortKeyConditionRange(options)</a> ⇒ <code>string</code> | <code>undefined</code></dt>
<dd><p>Get a range sort key condition for a DynamoDB query &amp; update query objects.</p>
</dd>
</dl>

<a name="addFilterConditionBeginsWith"></a>

## addFilterConditionBeginsWith(options) ⇒ <code>undefined</code>
Add begins_with filter condition to DynamoDB query objects.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | config object |
| options.attributeName | <code>string</code> | The name of the attribute to filter on. |
| options.attributeValue | <code>string</code> | The beginning value of the attribute to filter on. |
| options.expressionAttributeNames | <code>object</code> | The expression attribute names object to add the attribute name to. |
| options.expressionAttributeValues | <code>object</code> | The expression attribute values object to add the attribute value to. |
| options.filterConditions | <code>Array.&lt;string&gt;</code> | The filter conditions array to add the filter condition to. |

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

<a name="getShardQuery"></a>

## getShardQuery(options) ⇒ <code>function</code>
Get a shard query function for use with Entity Manager query function.

**Kind**: global function  
**Returns**: <code>function</code> - The shard query function.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | config object |
| options.dbClient | <code>object</code> | The Wrapped DynamoDB client. |
| [options.expressionAttributeNames] | <code>object</code> | The expression attribute names object. |
| [options.expressionAttributeValues] | <code>object</code> | The expression attribute values object. |
| [options.filterConditions] | <code>Array.&lt;string&gt;</code> | The filter conditions array. |
| [options.indexName] | <code>string</code> | The name of the index to query. |
| options.partitionKeyName | <code>string</code> | The name of the partition key. |
| [options.scanIndexForward] | <code>boolean</code> | Whether to scan the index forward. |
| [options.sortKeyCondition] | <code>string</code> | The sort key condition. |

<a name="parseBooleanQueryParam"></a>

## parseBooleanQueryParam(param, token) ⇒ <code>boolean</code> \| <code>undefined</code>
Parse a string query parameter into a boolean value.

**Kind**: global function  
**Returns**: <code>boolean</code> \| <code>undefined</code> - The parsed boolean value.  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>string</code> | The query parameter to parse. |
| token | <code>string</code> | The name of the query parameter. |

<a name="parseWholeNumberQueryParam"></a>

## parseWholeNumberQueryParam(param, token) ⇒ <code>number</code> \| <code>undefined</code>
Parse a string query parameter into a whole number value.

**Kind**: global function  
**Returns**: <code>number</code> \| <code>undefined</code> - The parsed whole number value.  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>string</code> | The query parameter to parse. |
| token | <code>string</code> | The name of the query parameter. |

<a name="sortKeyConditionBeginsWith"></a>

## sortKeyConditionBeginsWith(options) ⇒ <code>string</code> \| <code>undefined</code>
Get a begins_with sort key condition for a DynamoDB query & update query objects.

**Kind**: global function  
**Returns**: <code>string</code> \| <code>undefined</code> - The sort key condition.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | config object |
| options.entityManager | <code>object</code> | The entity manager. |
| options.entityToken | <code>string</code> | The entity token. |
| options.expressionAttributeNames | <code>object</code> | The expression attribute names object to add the attribute name to. |
| options.expressionAttributeValues | <code>object</code> | The expression attribute values object to add the attribute value to. |
| options.item | <code>object</code> | An item containing enough data to generate the partial sort key. |
| options.sortKeyName | <code>string</code> | The name of the sort key. |

<a name="sortKeyConditionRange"></a>

## sortKeyConditionRange(options) ⇒ <code>string</code> \| <code>undefined</code>
Get a range sort key condition for a DynamoDB query & update query objects.

**Kind**: global function  
**Returns**: <code>string</code> \| <code>undefined</code> - The sort key condition.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | config object |
| options.entityManager | <code>object</code> | The entity manager. |
| options.entityToken | <code>string</code> | The entity token. |
| options.expressionAttributeNames | <code>object</code> | The expression attribute names object to add the attribute name to. |
| options.expressionAttributeValues | <code>object</code> | The expression attribute values object to add the attribute value to. |
| options.itemFrom | <code>object</code> | An item containing enough data to generate the 'from' sort key. |
| options.itemTo | <code>object</code> | An item containing enough data to generate the 'to' sort key. |
| options.sortKeyName | <code>string</code> | The name of the sort key. |


---

See more great templates and other tools on
[my GitHub Profile](https://github.com/karmaniverous)!
