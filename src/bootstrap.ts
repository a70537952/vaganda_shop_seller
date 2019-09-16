import Echo from 'laravel-echo';
import parseDomain from 'parse-domain';

if (window.location.hostname === 'localhost' && process.env.REACT_APP_DOMAIN) {
  window.location.hostname = process.env.REACT_APP_DOMAIN;
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

window.io = require('socket.io-client');

let echoConfig = {
  broadcaster: 'socket.io',
  host: 'socket.' + domain + ':6001'
};

// if (hostname !== 'vaganda.shop') {
// 	// development
// 	echoConfig.key = '4c1006abc85868d19e49';
// 	echoConfig.encrypted = true;
// } else {
// 	// production
// 	echoConfig.key = 'f73a254e543c4d7f71f0';
// 	echoConfig.encrypted = true;
// }

// window.Echo = new Echo(echoConfig);
