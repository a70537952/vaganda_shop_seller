import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import update from 'immutability-helper';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { CookiesProvider, withCookies } from 'react-cookie';
import ReactDOM from 'react-dom';
import './i18n'; //must import i18n
import { WithTranslation, withTranslation } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../components/seller/Header';
import { AppContext, IContext } from '../../contexts/seller/Context';
import apolloClient from '../../apolloClient';
import gql from 'graphql-tag';
import { ReactCookieProps } from 'react-cookie/es6/types';
import '../../sass/seller.scss';

interface IProps {
  cookies?: any;
}

interface IState {
  context: IContext;
  contextLoading: boolean;
}

class Index extends React.Component<
  IProps & WithTranslation & ReactCookieProps,
  IState
> {
  constructor(props: IProps & WithTranslation & ReactCookieProps) {
    super(props);
    this.state = {
      context: {
        user: null,
        shop: null,
        getContext: this.getContext.bind(this),
        permission: [],
        shopList: [],
        shopSetting: {},
        shopAdminList: [],
        shopAdmin: null,
        switchShop: this.switchShop.bind(this)
      },
      contextLoading: true
    };
  }

  async componentDidMount() {
    let react = this;
    await this.getContext();
  }

  async getContext() {
    let react = this;
    await this.getContextUser();
    await this.getContextShop();
    await react.setState(
      update(this.state, {
        contextLoading: { $set: false }
      })
    );
  }

  getContextUser() {
    let react = this;
    return apolloClient
      .query({
        query: gql`
          query User {
            user {
              items {
                id
                name
                email
                user_info {
                  id
                  avatar
                  avatar_original
                  avatar_small
                  avatar_medium
                  avatar_large
                }
              }
            }
          }
        `
      })
      .then((response: any) => {
        let user = response.data.user.items[0];
        if (!user) {
          window.location.href = '//' + process.env.REACT_APP_DOMAIN;
        }

        // Echo.private('App.User.' + user.id)
        //     .listen('.ExampleEvent', (e) => {
        //         console.log('e', e);
        //     });
        react.setState(
          update(this.state, {
            context: {
              user: { $set: response.data.user.items[0] }
            }
          })
        );
      });
  }

  getContextShop() {
    let react = this;
    return apolloClient
      .query({
        query: gql`
          query ShopAdmin($user_id: String) {
            shopAdmin(user_id: $user_id) {
              items {
                id
                shop_id
                user_id
                shop_admin_role_id
                shop_admin_role {
                  id
                  title
                  permission
                  is_shop_owner_role
                }
                shop {
                  id
                  name
                  shop_category_id
                  name
                  has_physical_shop
                  shop_info {
                    logo
                    logo_small
                    logo_medium
                  }
                  shop_setting {
                    id
                    title
                    value
                  }
                }
              }
            }
          }
        `,
        variables: { user_id: this.state.context.user.id }
      })
      .then((response: any) => {
        let shopAdmins = response.data.shopAdmin.items;
        let shopAdmin = shopAdmins[0];
        if (!shopAdmin) {
          window.location.href = '//' + process.env.REACT_APP_DOMAIN;
        }
        let selectedShopId = this.props.cookies.get('shopId');
        if (selectedShopId) {
          shopAdmin =
            shopAdmins.find(
              (shopAdmin: any) => shopAdmin.shop_id === selectedShopId
            ) || shopAdmin;
        }
        this.props.cookies.set('shopId', shopAdmin.shop_id);
        return react.setState(
          update(this.state, {
            context: {
              shop: { $set: shopAdmin.shop },
              shopList: {
                $set: shopAdmins.map((shopAdmin: any) => shopAdmin.shop)
              },
              shopSetting: {
                $set: shopAdmin.shop.shop_setting.reduce(
                  (result: any, item: any) => {
                    result[item.title] = item.value;
                    return result;
                  },
                  {}
                )
              },
              shopAdminList: { $set: shopAdmins },
              shopAdmin: { $set: shopAdmin },
              permission: { $set: shopAdmin.shop_admin_role.permission }
            }
          })
        );
      });
  }

  switchShop(shopId: string) {
    let shopAdmin = this.state.context.shopAdminList.find(
      (shopAdmin: any) => shopAdmin.shop_id === shopId
    );

    if (shopAdmin) {
      this.props.cookies.set('shopId', shopAdmin.shop.id);
      this.setState(
        update(this.state, {
          context: {
            shop: { $set: shopAdmin.shop },
            shopSetting: {
              $set: shopAdmin.shop.shop_setting.reduce(
                (result: any, item: any) => {
                  result[item.title] = item.value;
                  return result;
                },
                {}
              )
            },
            shopAdmin: { $set: shopAdmin },
            permission: { $set: shopAdmin.shop_admin_role.permission }
          }
        })
      );
    }
  }

  render() {
    if (this.state.contextLoading) return null;
    const supportsHistory = 'pushState' in window.history;

    const primaryMain = '#ff5722';
    const primaryLight = '#ff784e';
    const primaryDark = '#da481b';

    const theme = createMuiTheme({
      palette: {
        primary: {
          light: primaryLight,
          dark: primaryDark,
          main: primaryMain,
          contrastText: '#fff'
        },
        secondary: {
          main: '#0c2646'
        }
      },
      spacing: 8,
      typography: {},
      overrides: {
        MuiFormLabel: {
          root: {
            '&$focused': {
              color: primaryMain
            }
          }
        },
        MuiInput: {
          underline: {
            '&:after': {
              borderBottom: '2px solid ' + primaryMain
            }
          }
        }
      }
    });
    return (
      <React.Fragment>
        <BrowserRouter forceRefresh={!supportsHistory}>
          <ApolloProvider client={apolloClient}>
            <CookiesProvider>
              <AppContext.Provider value={this.state.context}>
                <MuiThemeProvider theme={theme}>
                  <CssBaseline />
                  <SnackbarProvider
                    maxSnack={3}
                    action={[
                      <Button key={'dismiss'} color="primary" size="small">
                        Dismiss
                      </Button>
                    ]}
                  >
                    <Header context={this.state.context} />
                  </SnackbarProvider>
                </MuiThemeProvider>
              </AppContext.Provider>
            </CookiesProvider>
          </ApolloProvider>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

const IndexHOC = withTranslation()(withCookies(Index));

if (document.getElementById('react-index')) {
  ReactDOM.render(<IndexHOC />, document.getElementById('react-index'));
}

export default IndexHOC;
