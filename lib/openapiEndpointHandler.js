// npm imports
import createError from 'http-errors';
import _ from 'lodash';
import { OpenAPIClientAxios } from 'openapi-client-axios';

// lib imports
import wrapInternalHandler from './wrapInternalHandler.js';

export const openapiEndpointHandlerNaked = async ({
  data = {},
  options = {},
}) => {
  const {
    auth,
    definition,
    operationId,
    queryParams = [],
    config = {},
  } = options;

  if (!definition)
    throw new createError.BadRequest('Missing OpenAPI definition');

  if (!operationId)
    throw new createError.BadRequest('Missing OpenAPI operationId');

  if (auth) {
    switch (auth.type) {
      case 'apiKey': {
        config.headers = {
          ...(config.headers ?? {}),
          apiKey: auth.config.apiKey,
        };
        break;
      }
      default:
        throw new createError.BadRequest(
          `Unsupported OpenAPI auth type '${auth.type}'`
        );
    }
  }

  const client = await new OpenAPIClientAxios({ definition }).getClient();
  const response = await client[operationId](
    _.pick(data, queryParams),
    _.omit(data, queryParams),
    { ...config, validateStatus: null }
  );

  if (response.status >= 400) {
    const { data, status, statusText } = response;
    throw new createError(status, JSON.stringify({ status, statusText, data }));
  }

  return response.data;
};

export default wrapInternalHandler(openapiEndpointHandlerNaked);
