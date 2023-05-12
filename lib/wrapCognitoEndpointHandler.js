// lib imports
import getCognitoUserId from './getCognitoUserId.js';
import wrapEndpointHandler from './wrapEndpointHandler.js';

export default (handler, { eventSchema, responseSchema, getUser } = {}) =>
  wrapEndpointHandler(
    async (event, context) => {
      const userId = await getCognitoUserId(event);

      context.user = getUser ? (await getUser({ userId })).data : { userId };

      return await handler(event, context);
    },
    { eventSchema, responseSchema }
  );
