import parseDomain from "parse-domain";
import Echo from 'laravel-echo';
import io from 'socket.io-client';
import Cookies from "js-cookie";
import { getCookieKey } from "./utils/CookieUtil";

if (window.location.hostname === 'localhost' && process.env.REACT_APP_SELLER_DOMAIN) {
  window.location.hostname = process.env.REACT_APP_SELLER_DOMAIN;
}
let domainData: any = parseDomain(window.location.hostname, {
  customTlds: ['local', 'localhost']
});

let domain = domainData.domain + '.' + domainData.tld;

declare global {
  interface Window {
    Echo: any;
    io: any;
    FB: any;
  }
}

declare var window: Window;

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

window.io = io;

let echoConfig = {
  broadcaster: 'socket.io',
  host: 'socket.' + domain + ':6001',
  auth:        {
    headers: {
      Authorization: 'Bearer ' + Cookies.get(getCookieKey('api_token')),
    },
  },
};


window.Echo = new Echo(echoConfig);
