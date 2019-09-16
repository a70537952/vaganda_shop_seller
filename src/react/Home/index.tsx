import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import update from 'immutability-helper';
import { SnackbarProvider } from 'notistack';
import React, { useEffect, useState } from 'react';
import { ApolloProvider } from 'react-apollo';
import ReactDOM from 'react-dom';
import './i18n'; //must import i18n
import { useTranslation } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../components/home/Header';
import Footer from '../../components/home/Footer';
import { AppContext } from '../../contexts/home/Context';
import apolloClient from '../../apolloClient';
import gql from 'graphql-tag';
import { CookiesProvider } from 'react-cookie';
import '../../sass/home.scss';

function Index() {
  const { t } = useTranslation();

  const [context, setContext] = useState<{
    getContext: () => void;
    user: any;
  }>({
    getContext: getContext,
    user: null
  });

  useEffect(() => {
    getContext();
  }, []);
  const [contextLoading, setContextLoading] = useState<boolean>(true);

  function getContext() {
    apolloClient
      .query({
        query: gql`
          query User {
            user {
              items {
                id
                name
                email
                email_verified_at
                is_sign_up_user
                user_info {
                  id
                  avatar
                  avatar_original
                  avatar_small
                  avatar_medium
                  avatar_large
                  phone_country_code
                  phone
                }
                user_address {
                  id
                  user_id
                  address_1
                  address_2
                  address_3
                  city
                  state
                  postal_code
                  country
                }
                shop_admins {
                  id
                  shop_id
                }
              }
            }
          }
        `,
        fetchPolicy: 'network-only'
      })
      .then(({ data }) => {
        setContext(context =>
          update(context, {
            user: { $set: data.user.items[0] }
          })
        );
        setContextLoading(false);
      });
  }

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

  if (contextLoading) return null;
  return (
    <React.Fragment>
      <BrowserRouter forceRefresh={!supportsHistory}>
        <ApolloProvider client={apolloClient}>
          <CookiesProvider>
            <AppContext.Provider value={context}>
              <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <SnackbarProvider
                  maxSnack={3}
                  action={[
                    <Button key={'close'} color="primary" size="small">
                      {t('global$$close')}
                    </Button>
                  ]}
                >
                  <>
                    <Header context={context} />
                    <Footer context={context} />
                  </>
                </SnackbarProvider>
              </MuiThemeProvider>
            </AppContext.Provider>
          </CookiesProvider>
        </ApolloProvider>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default Index;
