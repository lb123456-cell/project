export const oktaConfig = {
    clientId: '0oapopjs7sQ6BSFkL5d7',
    issuer: 'https://dev-82468450.okta.com/oauth2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disablehttpCheck: true, 
};
