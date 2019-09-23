type CookiesKey = 'api_token';

const cookieKeyDefaultValue = {
  api_token: 'api_token'
};

export let getCookieKey = (key: CookiesKey): string => {
  return cookieKeyDefaultValue[key];
};

export let getCookieOption = () => {
  return { domain: process.env.REACT_APP_COOKIE_DOMAIN, secure: true };
};
