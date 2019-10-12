import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import update from "immutability-helper";
import { SnackbarProvider } from "notistack";
import React, { useEffect, useState } from "react";
import { ApolloProvider } from "react-apollo";
import { CookiesProvider, useCookies } from "react-cookie";
import "./i18n"; //must import i18n
import { BrowserRouter } from "react-router-dom";
import Header from "../components/seller/Header";
import { AppContext } from "../contexts/Context";
import apolloClient from "../apolloClient";
import { userQuery } from "../graphql/query/UserQuery";
import { userFragments } from "../graphql/fragment/query/UserFragment";
import { shopAdminQuery } from "../graphql/query/ShopAdminQuery";
import { shopAdminFragments } from "../graphql/fragment/query/ShopAdminFragment";
import { getCookieOption } from "../utils/CookieUtil";
import { IUserFragmentIndex } from "../graphql/fragmentType/query/UserFragmentInterface";
import { WithPagination } from "../graphql/query/Query";
import { IShopAdminFragmentIndex } from "../graphql/fragmentType/query/ShopAdminFragmentInterface";

export default function Index() {
  const [cookies, setCookie] = useCookies();
  const [context, setContext] = useState<{
    user: any,
    shop: any,
    permission: string[],
    shopList: any[],
    shopSetting: any,
    shopAdminList: any[],
    shopAdmin: any
  }>({
    user: null,
    shop: null,
    permission: [],
    shopList: [],
    shopSetting: {},
    shopAdminList: [],
    shopAdmin: null
  });

  useEffect(() => {
    getContext();
  }, []);
  const [contextLoading, setContextLoading] = useState<boolean>(true);

  function getContext() {
    getContextUser();
  }

  function getContextUser() {
    return apolloClient.query<{ user: WithPagination<IUserFragmentIndex> }>({
      query: userQuery(userFragments.Index),
      fetchPolicy: "network-only"
    })
      .then(({ data }) => {
        let user = data.user.items[0];
        if (!user) {
          window.location.href = "//" + process.env.REACT_APP_DOMAIN;
        }
        setContext(context =>
          update(context, {
            user: { $set: user }
          })
        );
        getContextShop(user.id);
      });
  }

  function getContextShop(userId: string) {
    return apolloClient
      .query<{ shopAdmin: WithPagination<IShopAdminFragmentIndex> }>({
        query: shopAdminQuery(shopAdminFragments.Index),
        fetchPolicy: "network-only",
        variables: { user_id: userId }
      })
      .then(({ data }) => {
        let shopAdmins = data.shopAdmin.items;
        let shopAdmin = shopAdmins[0];
        if (!shopAdmin) {
          window.location.href = "//" + process.env.REACT_APP_DOMAIN;
        }
        let selectedShopId = cookies.shopId;
        if (selectedShopId) {
          shopAdmin =
            shopAdmins.find(
              (shopAdmin: any) => shopAdmin.shop_id === selectedShopId
            ) || shopAdmin;
        }
        setCookie("shopId", shopAdmin.shop_id, getCookieOption());
        setContext(context =>
          update(context, {
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
          })
        );
        setContextLoading(false);
      });
  }

  function switchShop(shopId: string) {
    let shopAdmin = context.shopAdminList.find(
      (shopAdmin: any) => shopAdmin.shop_id === shopId
    );
    if (shopAdmin) {
      setCookie("shopId", shopAdmin.shop_id, getCookieOption());
      setContext(context =>
        update(context, {
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
        })
      );
    }
  }

  useEffect(() => {
    if(context.user) {
      Echo.private('App.Chat.' + context.user.id);
        // .listen('.ExampleEvent', (e: any) => {
        //   console.log('e', e);
        // });

      return () => {
        Echo.leave('App.Chat.' + context.user.id);
      };
    }
  }, [JSON.stringify(context.user)]);


  const supportsHistory = "pushState" in window.history;
  const primaryMain = "#ff5722";
  const primaryLight = "#ff784e";
  const primaryDark = "#da481b";
  const theme = createMuiTheme({
    palette: {
      primary: {
        light: primaryLight,
        dark: primaryDark,
        main: primaryMain,
        contrastText: "#fff"
      },
      secondary: {
        main: "#0c2646"
      }
    },
    spacing: 8,
    typography: {},
    overrides: {
      MuiFormLabel: {
        root: {
          "&$focused": {
            color: primaryMain
          }
        }
      },
      MuiInput: {
        underline: {
          "&:after": {
            borderBottom: "2px solid " + primaryMain
          }
        }
      }
    }
  });

  if (contextLoading) return null;
  return (
    <React.Fragment>
      <BrowserRouter forceRefresh={!supportsHistory}>
        <ApolloProvider client={apolloClient}>
          <CookiesProvider>
            <AppContext.Provider value={{ ...context, ...{ switchShop, getContext } }}>
              <MuiThemeProvider theme={theme}>
                <CssBaseline/>
                <SnackbarProvider
                  maxSnack={3}
                  action={[
                    <Button key={"dismiss"} color="primary" size="small">
                      Dismiss
                    </Button>
                  ]}
                >
                  <Header/>
                </SnackbarProvider>
              </MuiThemeProvider>
            </AppContext.Provider>
          </CookiesProvider>
        </ApolloProvider>
      </BrowserRouter>
    </React.Fragment>
  );
}