import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Popover from "@material-ui/core/Popover";
import { makeStyles } from "@material-ui/core/styles/index";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import RepeatIcon from "@material-ui/icons/Repeat";
import classnames from "classnames";
import React, { useContext, useState } from "react";

import { Link, NavLink, Route, Switch } from "react-router-dom";
import { AppContext } from "../../contexts/Context";
import sellerRoutes from "../../routes/seller";
import ShopLogo from "./../ShopLogo";
import UserAvatar from "./../UserAvatar";
import { useTranslation } from "react-i18next";
import ErrorBoundary from "./ErrorBoundary";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import { homePath, sellerPath } from "../../utils/RouteUtil";
import { useCookies } from "react-cookie";
import { getCookieKey, getGlobalCookieOption } from "../../utils/CookieUtil";
import useTheme from "@material-ui/core/styles/useTheme";
import { useMediaQuery } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => {
  const drawerWidth = 265;

  return {
    root: {
      display: "flex"
    },
    appBar: {
      // zIndex: theme.zIndex.drawer + 1,
      backgroundColor: theme.palette.primary.main
    },
    drawer: {
      [theme.breakpoints.up("lg")]: {
        width: drawerWidth
      },
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth
      // backgroundColor: theme.palette.primary.main
    },
    switchShopDrawerPaper: {
      minWidth: "400px",
      padding: theme.spacing(1)
    },
    toolbar: theme.mixins.toolbar,
    grow: {
      flexGrow: 1
    },
    title: {
      display: "block",
      [theme.breakpoints.up("lg")]: {
        marginLeft: drawerWidth
      },
      textDecoration: "none",
      transition: "all 0.5s"
    },
    unsetBackground: {
      "&:hover": {
        backgroundColor: "unset"
      }
    },
    menuButton: {
      [theme.breakpoints.up("lg")]: {
        display: "none"
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
      width: "100%"
    },
    drawerListItem: {
      margin: "10px 15px 10px 15px",
      width: "unset",
      transition: "filter 0.15s"
    },
    currentActiveListItem: {
      backgroundColor: theme.palette.primary.main + " !important",
      "& div": {
        color: "white"
      },
      "& span": {
        color: "white"
      },
      "&:hover": {
        filter: "brightness(95%)"
      }
    },
    buttonGoToShop: {
      marginLeft: theme.spacing(1)
    }
  };
});

export default function Header() {
  const classes = useStyles();
  const context = useContext(AppContext);
  const theme = useTheme();
  const { t } = useTranslation();
  const [cookies, setCookie, removeCookie] = useCookies();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isSwitchShopDialogOpen, setIsSwitchShopDialogOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<any>(null);

  function handleProfileMenuOpen(event: any) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function handleDrawerToggle() {
    setIsDrawerOpen(!isDrawerOpen);
  }

  function handleOpenSwitchShopDialog() {
    setIsSwitchShopDialogOpen(true);
  }

  function handleCloseSwitchShopDialog() {
    setIsSwitchShopDialogOpen(false);
  }

  const isMenuOpen = Boolean(anchorEl);
  return <div className={classes.root}>
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          onClick={handleDrawerToggle}
          className={classnames(classes.menuButton)}
        >
          <MenuIcon/>
        </IconButton>
        <Typography
          {...({
            component: Link,
            to: sellerPath("dashboard")
          } as any)}
          className={classes.title}
          variant="h6"
          color="inherit"
        >
          {t("seller center")}
        </Typography>

        <Button
          component="a"
          href={
            "//" +
            process.env.REACT_APP_DOMAIN +
            homePath("shopHome", {
              account: context.shopSetting.account
            })
          }
          className={classes.buttonGoToShop}
          color="inherit"
          size={"large"}
        >
          {t("go to shop")}
        </Button>

        <div className={classes.grow}/>

        <div>
          <IconButton
            aria-owns={isMenuOpen ? "material-appbar" : undefined}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            className={classes.unsetBackground}
          >
            <UserAvatar user={context.user}/>
          </IconButton>
          <Popover
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            open={isMenuOpen}
            onClose={handleMenuClose}
          >
            <React.Fragment>
              <MenuItem
                onClick={handleMenuClose}
                component={"a"}
                href={
                  "//" +
                  process.env.REACT_APP_DOMAIN +
                  homePath("home")
                }
              >
                {t("back to home")}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  removeCookie(getCookieKey("api_token"), getGlobalCookieOption());
                  window.location.reload();
                }}
              >
                {t("logout")}
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
          isLargeScreen
            ? "permanent"
            : "temporary"
        }
        anchor={theme.direction === "rtl" ? "right" : "left"}
        open={isDrawerOpen}
        onClose={handleDrawerToggle}
      >
        <List>
          <ListItem
            className={classes.drawerListItem}
            button
            onClick={handleOpenSwitchShopDialog}
          >
            <ListItemIcon>
              <ShopLogo
                className={classes.currentShopLogo}
                shop={context.shop}
              />
            </ListItemIcon>
            <ListItemText primary={context.shop.name}/>
            <RepeatIcon fontSize="small"/>
          </ListItem>
        </List>
        <Divider/>
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
                    style={{ textTransform: "capitalize" }}
                  />
                </ListItem>
              );
            })}
        </List>
      </Drawer>
    </nav>
    <Dialog
      classes={{ paper: classes.switchShopDrawerPaper }}
      onClose={handleCloseSwitchShopDialog}
      open={isSwitchShopDialogOpen}
      aria-labelledby="switch shop"
    >
      <DialogTitle id="switch shop">{t("switch shop")}</DialogTitle>
      <div>
        <List>
          {context.shopList.map((shop: any) => (
            <ListItem
              button
              key={shop.id}
              onClick={() => {
                context.switchShop(shop.id);
                handleCloseSwitchShopDialog();
              }}
            >
              <ListItemAvatar>
                <ShopLogo shop={shop}/>
              </ListItemAvatar>
              <ListItemText
                primary={
                  shop.name +
                  (shop.id === context.shop.id
                    ? " (" + t("current") + ")"
                    : "")
                }
              />
            </ListItem>
          ))}
        </List>
      </div>
      <Grid container justify="flex-end">
        <Button
          color="primary"
          onClick={handleCloseSwitchShopDialog}
        >
          {t("cancel")}
        </Button>
      </Grid>
    </Dialog>
    <main className={classes.content}>
      <div className={classes.toolbar}/>
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
  </div>;
}