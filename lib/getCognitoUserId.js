// Configure Cognito client.
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
const cognitoIdentityProvider = new CognitoIdentityProvider({
  region: process.env.AWS_DEFAULT_REGION,
});

export default async (event) =>
  (
    (
      await cognitoIdentityProvider.adminGetUser({
        UserPoolId: process.env.USER_POOL_ID,
        Username: event.requestContext.authorizer.claims['cognito:username'],
      })
    ).UserAttributes.find(
      (attribute) => attribute.Name === 'dev:custom:userId'
    ) ?? {}
  ).Value;
