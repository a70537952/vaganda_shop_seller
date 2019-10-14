import axios from "axios";
import Cookies from "js-cookie";
import { getCookieKey } from "./utils/CookieUtil";

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.baseURL = `https://${process.env.REACT_APP_API_URL}/`;

let apiToken = Cookies.get(getCookieKey('api_token'));

if (apiToken) {
  axios.defaults.headers.Authorization = 'Bearer ' + apiToken;
}
let locale = localStorage.getItem('i18nextLng');
if (locale) {
  axios.defaults.headers.Locale = locale;
}

export default axios;
