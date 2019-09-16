import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles/index';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import MenuIcon from '@material-ui/icons/menu';
import RepeatIcon from '@material-ui/icons/repeat';
import classnames from 'classnames';
import React from 'react';

import { Link, NavLink, Route, Switch, withRouter } from 'react-router-dom';
import { AppContext } from '../../contexts/seller/Context';
import sellerRoutes from '../../routes/seller';
import ShopLogo from './../ShopLogo';
import UserAvatar from './../UserAvatar';
import { WithTranslation, withTranslation } from 'react-i18next';
import ErrorBoundary from './ErrorBoundary';
import { RouteComponentProps } from 'react-router';
import { WithWidth } from '@material-ui/core/withWidth/withWidth';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { homePath, sellerPath } from '../../utils/RouteUtil';
import { ReactCookieProps, withCookies } from 'react-cookie';
import { getCookieKey, getCookieOption } from '../../utils/CookieUtil';

interface IProps {
  classes: any;
  theme: Theme;
  context: any;
}

interface IState {
  isDrawerOpen: boolean;
  isSwitchShopDialogOpen: boolean;
  anchorEl: any;
}

class Header extends React.Component<
  IProps & RouteComponentProps & WithTranslation & WithWidth & ReactCookieProps,
  IState
> {
  constructor(
    props: IProps &
      RouteComponentProps &
      WithTranslation &
      WithWidth &
      ReactCookieProps
  ) {
    super(props);
    this.state = {
      anchorEl: null,
      isDrawerOpen: false,
      isSwitchShopDialogOpen: false
    };
  }

  handleProfileMenuOpen(event: any) {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleMenuClose() {
    this.setState({ anchorEl: null });
  }

  handleDrawerToggle() {
    this.setState({ isDrawerOpen: !this.state.isDrawerOpen });
  }

  handleOpenSwitchShopDialog() {
    this.setState({
      isSwitchShopDialogOpen: true
    });
  }

  handleCloseSwitchShopDialog() {
    this.setState({
      isSwitchShopDialogOpen: false
    });
  }

  render() {
    const { anchorEl, isDrawerOpen, isSwitchShopDialogOpen } = this.state;
    const { classes, theme, t } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    return (
      <AppContext.Consumer>
        {context => (
          <React.Fragment>
            <div className={classes.root}>
              <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                  <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={this.handleDrawerToggle.bind(this)}
                    className={classnames(classes.menuButton, open)}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Typography
                    {...({
                      component: Link,
                      to: sellerPath('dashboard')
                    } as any)}
                    className={classes.title}
                    variant="h6"
                    color="inherit"
                  >
                    {t('seller center')}
                  </Typography>

                  <Button
                    component="a"
                    href={
                      '//' +
                      process.env.REACT_APP_DOMAIN +
                      homePath('shopHome', {
                        account: context.shopSetting.account
                      })
                    }
                    className={classes.buttonGoToShop}
                    color="inherit"
                    size={'large'}
                  >
                    {t('go to shop')}
                  </Button>

                  <div className={classes.grow}></div>

                  <div>
                    <IconButton
                      aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                      aria-haspopup="true"
                      onClick={this.handleProfileMenuOpen.bind(this)}
                      color="inherit"
                      className={classes.unsetBackground}
                    >
                      <UserAvatar user={context.user} />
                    </IconButton>
                    <Popover
                      anchorEl={anchorEl}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                      open={isMenuOpen}
                      onClose={this.handleMenuClose.bind(this)}
                    >
                      <React.Fragment>
                        <MenuItem
                          onClick={this.handleMenuClose.bind(this)}
                          component={'a'}
                          href={
                            '//' +
                            process.env.REACT_APP_DOMAIN +
                            homePath('home')
                          }
                        >
                          {t('back to home')}
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            if (this.props.cookies) {
                              this.props.cookies.remove(
                                getCookieKey('api_token'),
                                getCookieOption()
                              );
                            }
                            window.location.reload();
                          }}
                        >
                          {t('logout')}
                        </MenuItem>
                      </React.Fragment>
                    </Popover>
                  </div>
                </Toolbar>
              </AppBar>
              <nav className={classes.drawer}>
                <Drawer
                  classes={{
                    paper: classes.drawerPaper
                  }}
                  variant={
                    isWidthUp('lg', this.props.width)
                      ? 'permanent'
                      : 'temporary'
                  }
                  anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                  open={isDrawerOpen}
                  onClose={this.handleDrawerToggle.bind(this)}
                >
                  <List>
                    <ListItem
                      className={classes.drawerListItem}
                      button
                      onClick={this.handleOpenSwitchShopDialog.bind(this)}
                    >
                      <ListItemIcon>
                        <ShopLogo
                          className={classes.currentShopLogo}
                          shop={context.shop}
                        />
                      </ListItemIcon>
                      <ListItemText primary={context.shop.name} />
                      <RepeatIcon fontSize="small" />
                    </ListItem>
                  </List>
                  <Divider />
                  <List>
                    {Object.keys(sellerRoutes)
                      .filter(
                        key =>
                          !sellerRoutes[key].permission ||
                          sellerRoutes[key].permission.every(
                            (permission: string) =>
                              context.permission.includes(permission)
                          )
                      )
                      .map(routeName => {
                        let route = sellerRoutes[routeName];
                        if (!route.showInDrawer) return null;
                        return (
                          <ListItem
                            key={routeName}
                            button
                            exact={route.exact}
                            className={classes.drawerListItem}
                            activeClassName={classes.currentActiveListItem}
                            {...({ component: NavLink, to: route.path } as any)}
                          >
                            <ListItemIcon>
                              {React.createElement(route.showInDrawer.icon, {})}
                            </ListItemIcon>
                            <ListItemText
                              primary={t(route.showInDrawer.text)}
                              style={{ textTransform: 'capitalize' }}
                            />
                          </ListItem>
                        );
                      })}
                  </List>
                </Drawer>
              </nav>
              <Dialog
                classes={{ paper: classes.switchShopDrawerPaper }}
                onClose={this.handleCloseSwitchShopDialog.bind(this)}
                open={isSwitchShopDialogOpen}
                aria-labelledby="switch shop"
              >
                <DialogTitle id="switch shop">{t('switch shop')}</DialogTitle>
                <div>
                  <List>
                    {context.shopList.map((shop: any) => (
                      <ListItem
                        button
                        key={shop.id}
                        onClick={() => {
                          context.switchShop(shop.id);
                          this.handleCloseSwitchShopDialog();
                        }}
                      >
                        <ListItemAvatar>
                          <ShopLogo shop={shop} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            shop.name +
                            (shop.id === context.shop.id
                              ? ' (' + t('current') + ')'
                              : '')
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </div>
                <Grid container justify="flex-end">
                  <Button
                    color="primary"
                    onClick={this.handleCloseSwitchShopDialog.bind(this)}
                  >
                    {t('cancel')}
                  </Button>
                </Grid>
              </Dialog>
              <main className={classes.content}>
                <div className={classes.toolbar} />
                <ErrorBoundary>
                  <Switch>
                    {Object.keys(sellerRoutes).map(routeName => {
                      let route = sellerRoutes[routeName];

                      return (
                        <Route
                          key={routeName}
                          exact={route.exact}
                          path={route.path}
                          render={() =>
                            React.createElement(route.component, {
                              context: context
                            })
                          }
                        />
                      );
                    })}
                  </Switch>
                </ErrorBoundary>
              </main>
            </div>
          </React.Fragment>
        )}
      </AppContext.Consumer>
    );
  }
}

const drawerWidth = 265;

export default withWidth()(
  withStyles(
    theme => ({
      root: {
        display: 'flex'
      },
      appBar: {
        // zIndex: theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.primary.main
      },
      drawer: {
        [theme.breakpoints.up('lg')]: {
          width: drawerWidth
        },
        flexShrink: 0
      },
      drawerPaper: {
        width: drawerWidth
        // backgroundColor: theme.palette.primary.main
      },
      switchShopDrawerPaper: {
        minWidth: '400px',
        padding: theme.spacing(1)
      },
      toolbar: theme.mixins.toolbar,
      grow: {
        flexGrow: 1
      },
      title: {
        display: 'block',
        [theme.breakpoints.up('lg')]: {
          marginLeft: drawerWidth
        },
        textDecoration: 'none',
        transition: 'all 0.5s'
      },
      unsetBackground: {
        '&:hover': {
          backgroundColor: 'unset'
        }
      },
      menuButton: {
        [theme.breakpoints.up('lg')]: {
          display: 'none'
        },
        marginLeft: 12,
        marginRight: 20
      },
      currentShopLogo: {
        width: 24,
        height: 24
      },
      content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        width: '100%'
      },
      drawerListItem: {
        margin: '10px 15px 10px 15px',
        width: 'unset',
        transition: 'filter 0.15s'
      },
      currentActiveListItem: {
        backgroundColor: theme.palette.primary.main + ' !important',
        '& div': {
          color: 'white'
        },
        '& span': {
          color: 'white'
        },
        '&:hover': {
          filter: 'brightness(95%)'
        }
      },
      buttonGoToShop: {
        marginLeft: theme.spacing(1)
      }
    }),
    { withTheme: true }
  )(withTranslation()(withCookies(withRouter(Header))))
);
