export default <any>{
  home: {
    path: '/',
    exact: true,
  },
  account: {
    path: '/account',
    exact: false,
    auth: true
  },
  accountEdit: {
    path: '/account/edit'
  },
  accountEditAddress: {
    path: '/account/edit/address'
  },
  accountEditContact: {
    path: '/account/edit/contact'
  },
  accountEditPassword: {
    path: '/account/edit/password'
  },
  createShop: {
    path: '/create/shop',
    exact: true,
    auth: true
  },
  resetPassword: {
    path: '/reset/password',
    exact: true,
  },
  shopHome: {
    path: '/shop/:account',
    exact: true,
  },
  search: {
    path: '/search/:searchType/:searchValue',
    exact: true,
  },
  product: {
    path: '/product/:productId',
    exact: true,
  },
  userCart: {
    path: '/cart',
    exact: true,
    auth: true
  },
  myOrder: {
    path: '/order',
    exact: false,
    auth: true
  },
  myOrderShip: {
    path: '/order/ship'
  },
  myOrderReceive: {
    path: '/order/receive'
  },
  myOrderComplete: {
    path: '/order/complete'
  },
  myOrderCancel: {
    path: '/order/cancel'
  },
  error404: {
    path: '',
    exact: true,
  }
};
