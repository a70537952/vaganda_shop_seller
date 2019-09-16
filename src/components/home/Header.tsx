import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import classnames from 'classnames';
import update from 'immutability-helper';
import React from 'react';
import { Link, Route, Switch, withRouter } from 'react-router-dom';
import { AppContext } from '../../contexts/home/Context';
import homeRoutes from '../../routes/home';
import UserAvatar from './../UserAvatar';
import AuthRoute from './AuthRoute';
import ModalLoginRegister from './Modal/ModalLoginRegister';
import { WithTranslation, withTranslation } from 'react-i18next';
import ErrorBoundary from './ErrorBoundary';
import { RouteComponentProps } from 'react-router';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Menu from '@material-ui/core/Menu';
import { homePath } from '../../utils/RouteUtil';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import UserCartButton from './UserCartButton';
import { ReactCookieProps, withCookies } from 'react-cookie';
import { getCookieKey, getCookieOption } from '../../utils/CookieUtil';

let t: any;

interface IProps {
  classes: any;
  context: any;
}

interface IState {
  modal: {
    loginRegister: boolean;
  };
  searchValue: string;
  searchInputData: {
    recentSearches: [];
    suggestionSearch: [];
  };
  isNavbarOpen: boolean;
  profileMenuAnchorEl: any;
  searchTypeMenuAnchorEl: any;
  searchType: 'product' | 'shop';
}

class Header extends React.Component<
  IProps &
    WithSnackbarProps &
    RouteComponentProps &
    WithTranslation &
    ReactCookieProps,
  IState
> {
  constructor(
    props: IProps &
      WithSnackbarProps &
      RouteComponentProps &
      WithTranslation &
      ReactCookieProps
  ) {
    super(props);

    t = this.props.t;

    this.state = {
      modal: {
        loginRegister: false
      },
      searchValue: '',
      searchInputData: {
        recentSearches: [],
        suggestionSearch: []
      },
      isNavbarOpen: false,
      profileMenuAnchorEl: null,
      searchTypeMenuAnchorEl: null,
      searchType: 'product'
    };
  }

  handleProfileMenuOpen(event: any) {
    this.setState({ profileMenuAnchorEl: event.currentTarget });
  }

  handleProfileMenuClose() {
    this.setState({ profileMenuAnchorEl: null });
  }

  handleSearchTypeMenuOpen(event: any) {
    this.setState({ searchTypeMenuAnchorEl: event.currentTarget });
  }

  handleSearchTypeMenuClose() {
    this.setState({ searchTypeMenuAnchorEl: null });
  }

  toggleModalLoginRegister() {
    this.setState(
      update(this.state, {
        modal: {
          loginRegister: { $set: !this.state.modal.loginRegister }
        }
      })
    );
  }

  onClickSearch() {
    if (!this.state.searchValue) return;
    this.props.history.push(
      `/search/${this.state.searchType}/${this.state.searchValue}`
    );
  }

  setSearchValue(val: string) {
    this.setState(
      update(this.state, {
        searchValue: { $set: val }
      })
    );
  }

  setSearchType(type: 'shop' | 'product') {
    this.setState(
      update(this.state, {
        searchType: { $set: type }
      })
    );
  }

  render() {
    const { profileMenuAnchorEl, searchTypeMenuAnchorEl } = this.state;
    const { classes, t } = this.props;
    const isProfileMenuOpen = Boolean(profileMenuAnchorEl);
    const isSearchTypeMenuOpen = Boolean(searchTypeMenuAnchorEl);

    return (
      <AppContext.Consumer>
        {(context: any) => (
          <div className={classes.root}>
            <AppBar position="static">
              <Toolbar>
                <Typography
                  {...({ component: Link, to: homePath('home') } as any)}
                  className={classes.title}
                  variant="h6"
                  color="inherit"
                >
                  {t('vaganda')}
                </Typography>
                <Typography
                  {...({ component: Link, to: homePath('home') } as any)}
                  className={classes.titleIcon}
                  variant="h6"
                  color="inherit"
                >
                  V
                </Typography>

                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    fullWidth
                    placeholder={t('search...')}
                    value={this.state.searchValue}
                    onChange={(e: any) => {
                      this.setSearchValue(e.target.value);
                    }}
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput
                    }}
                    onKeyPress={event => {
                      if (event.key == 'Enter') {
                        this.onClickSearch();
                      }
                    }}
                  />
                  <div className={classes.searchTypeContainer}>
                    <List
                      component="nav"
                      disablePadding
                      className={classes.searchTypeList}
                    >
                      <ListItem
                        className={classes.searchTypeListItem}
                        button
                        aria-haspopup="true"
                        aria-controls="search-type"
                        aria-label="When device is locked"
                        onClick={this.handleSearchTypeMenuOpen.bind(this)}
                      >
                        <ListItemText
                          primary={t(this.state.searchType)}
                          className={classes.searchTypeListItemText}
                          classes={{
                            primary: classes.searchTypeListItemTextPrimary
                          }}
                        />
                      </ListItem>
                    </List>
                    <Menu
                      id="search-type"
                      anchorEl={searchTypeMenuAnchorEl}
                      open={isSearchTypeMenuOpen}
                      onClose={this.handleSearchTypeMenuClose.bind(this)}
                    >
                      <MenuItem
                        selected={'product' === this.state.searchType}
                        onClick={() => {
                          this.setSearchType('product');
                          this.handleSearchTypeMenuClose();
                        }}
                      >
                        {t('product')}
                      </MenuItem>
                      <MenuItem
                        selected={'shop' === this.state.searchType}
                        onClick={() => {
                          this.setSearchType('shop');
                          this.handleSearchTypeMenuClose();
                        }}
                      >
                        {t('shop')}
                      </MenuItem>
                    </Menu>
                    <Button
                      variant="text"
                      color="primary"
                      className={classes.searchButton}
                      onClick={this.onClickSearch.bind(this)}
                    >
                      <SearchIcon />
                    </Button>
                  </div>
                </div>
                <UserCartButton />
                {context.user ? (
                  <div>
                    <IconButton
                      aria-owns={
                        isProfileMenuOpen ? 'material-appbar' : undefined
                      }
                      aria-haspopup="true"
                      onClick={this.handleProfileMenuOpen.bind(this)}
                      color="inherit"
                      className={classes.unsetBackground}
                    >
                      <UserAvatar user={context.user} />
                    </IconButton>
                    <Popover
                      anchorEl={profileMenuAnchorEl}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                      open={isProfileMenuOpen}
                      onClose={this.handleProfileMenuClose.bind(this)}
                    >
                      <React.Fragment>
                        {context.user.shop_admins &&
                          context.user.shop_admins.length !== 0 && (
                            <MenuItem
                              component={'a'}
                              href={'//' + process.env.REACT_APP_SELLER_DOMAIN}
                            >
                              {t('my shop')}
                            </MenuItem>
                          )}
                        <MenuItem
                          onClick={this.handleProfileMenuClose.bind(this)}
                          {...({
                            component: Link,
                            to: homePath('myOrder')
                          } as any)}
                        >
                          {t('my order')}
                        </MenuItem>
                        <MenuItem
                          onClick={this.handleProfileMenuClose.bind(this)}
                          {...({
                            component: Link,
                            to: homePath('createShop')
                          } as any)}
                        >
                          {t('create shop')}
                        </MenuItem>
                        <MenuItem
                          onClick={this.handleProfileMenuClose.bind(this)}
                          {...({
                            component: Link,
                            to: homePath('accountEdit')
                          } as any)}
                        >
                          {t('account setting')}
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
                ) : (
                  <div>
                    <Button
                      color="inherit"
                      onClick={this.toggleModalLoginRegister.bind(this)}
                      className={classnames(
                        classes.unsetBackground,
                        classes.login
                      )}
                    >
                      <UserAvatar className={classes.loginIcon} /> {t('login')}
                    </Button>
                    <ModalLoginRegister
                      toggle={this.toggleModalLoginRegister.bind(this)}
                      isOpen={this.state.modal.loginRegister}
                    />
                  </div>
                )}
              </Toolbar>
            </AppBar>
            <Grid container className={classes.contentContainer}>
              <ErrorBoundary>
                <Switch>
                  {Object.keys(homeRoutes).map(routeName => {
                    let route: any = (homeRoutes as any)[routeName];

                    if (route.component) {
                      if (route.auth) {
                        return (
                          <AuthRoute
                            key={routeName}
                            exact={route.exact}
                            path={route.path}
                            context={context}
                            component={route.component}
                            setSearchValue={this.setSearchValue.bind(this)}
                            setSearchType={this.setSearchType.bind(this)}
                          />
                        );
                      } else {
                        return (
                          <Route
                            key={routeName}
                            exact={route.exact}
                            path={route.path}
                            render={() =>
                              React.createElement(route.component, {
                                context: context,
                                setSearchValue: this.setSearchValue.bind(this),
                                setSearchType: this.setSearchType.bind(this)
                              })
                            }
                          />
                        );
                      }
                    }
                  })}
                </Switch>
              </ErrorBoundary>
            </Grid>
          </div>
        )}
      </AppContext.Consumer>
    );
  }
}

export default withStyles(theme => ({
  root: {
    width: '100%',
    minHeight: 'calc(100vh - 77px)'
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  title: {
    display: 'none',
    // [theme.breakpoints.up('sm')]: {
    //     display: 'block',
    // },
    textDecoration: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  titleIcon: {
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  search: {
    flexGrow: 1,
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(3),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing(9),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(16),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(10),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      // width: 200,
    }
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  unsetBackground: {
    '&:hover': {
      backgroundColor: 'unset'
    }
  },
  login: {
    fontSize: 15
  },
  loginIcon: {
    marginRight: theme.spacing(1)
  },
  contentContainer: {
    marginTop: theme.spacing(4)
  },
  searchTypeContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: '100%'
  },
  searchTypeList: {
    height: '100%',
    display: 'inline-block'
  },
  searchTypeListItem: {
    height: '100%',
    padding: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.08)'
  },
  searchTypeListItemTextPrimary: {
    color: '#fff'
  },
  searchTypeListItemText: {
    padding: '0 20px !important'
  },
  searchButton: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff'
  }
}))(withSnackbar(withTranslation()(withCookies(withRouter(Header)))));
