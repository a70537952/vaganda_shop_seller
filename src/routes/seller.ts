// import BubbleChartIcon from '@material-ui/icons/bubbleChart';
//
// import DashboardIcon from '@material-ui/icons/dashboard';
// import PermIdentityIcon from '@material-ui/icons/permIdentity';
// import SupervisorAccountIcon from '@material-ui/icons/supervisorAccount';
// import SettingsIcon from '@material-ui/icons/settings';
// import CategoryIcon from '@material-ui/icons/category';
// import ReceiptIcon from '@material-ui/icons/receipt';
// import CommentIcon from '@material-ui/icons/Comment';

import Error404 from '../components/seller/Error404';
import Admin from '../pages/seller/Admin';
import AdminRole from '../pages/seller/AdminRole';
import Dashboard from '../pages/seller/Dashboard';
import Product from '../pages/seller/Product';
import ProductCategory from '../pages/seller/ProductCategory';
import Setting from '../pages/seller/Setting';
import OrderDetail from '../pages/seller/OrderDetail';
import OrderComment from '../pages/seller/OrderComment';

export default <any>{
  dashboard: {
    path: '/',
    exact: true,
    component: Dashboard,
    showInDrawer: {
      text: 'dashboard'
      // icon: DashboardIcon
    },
    permission: []
  },
  orderComment: {
    path: '/order/comment',
    exact: true,
    component: OrderComment,
    showInDrawer: {
      text: 'order comment'
      // icon: CommentIcon
    },
    permission: ['VIEW_SHOP_USER_ORDER_DETAIL_COMMENT']
  },
  order: {
    path: '/order',
    exact: true,
    component: OrderDetail,
    showInDrawer: {
      text: 'order detail'
      // icon: ReceiptIcon
    },
    permission: ['VIEW_SHOP_USER_ORDER_DETAIL']
  },
  productCategory: {
    path: '/product/category',
    exact: true,
    component: ProductCategory,
    showInDrawer: {
      text: 'product category'
      // icon: CategoryIcon
    },
    permission: ['VIEW_SHOP_PRODUCT_CATEGORY']
  },
  product: {
    path: '/product',
    exact: true,
    component: Product,
    showInDrawer: {
      text: 'product'
      // icon: BubbleChartIcon
    },
    permission: ['VIEW_PRODUCT']
  },
  admin: {
    path: '/admin',
    exact: true,
    component: Admin,
    showInDrawer: {
      text: 'admin'
      // icon: SupervisorAccountIcon
    },
    permission: ['VIEW_SHOP_ADMIN']
  },
  adminRole: {
    path: '/admin/role',
    exact: true,
    component: AdminRole,
    showInDrawer: {
      text: 'admin role'
      // icon: PermIdentityIcon
    },
    permission: ['VIEW_SHOP_ADMIN_ROLE']
  },
  setting: {
    path: '/setting',
    exact: true,
    component: Setting,
    showInDrawer: {
      text: 'setting'
      // icon: SettingsIcon
    },
    permission: ['VIEW_SHOP_SETTING']
  },
  error404: {
    path: '',
    exact: true,
    component: Error404
  }
};
