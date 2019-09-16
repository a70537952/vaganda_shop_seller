import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';
import PhoneIcon from '@material-ui/icons/Phone';
import LockIcon from '@material-ui/icons/Lock';
import React from 'react';
import { NavLink, Route, withRouter } from 'react-router-dom';
import HomeHelmet from '../../components/home/HomeHelmet';
import FormEditUserAccount from '../../components/home/Form/FormEditUserAccount';
import FormEditUserAddress from '../../components/home/Form/FormEditUserAddress';
import FormEditUserContact from '../../components/home/Form/FormEditUserContact';
import FormEditUserPassword from '../../components/home/Form/FormEditUserPassword';
import { AppContext } from '../../contexts/home/Context';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import { homePath } from '../../utils/RouteUtil';

interface IProps {
  classes: any;
  context: any;
}

interface IState {
  location: any;
  tabs: string[];
  value: number;
}

export class AccountEdit extends React.Component<
  IProps & RouteComponentProps & WithTranslation,
  IState
> {
  constructor(props: IProps & RouteComponentProps & WithTranslation) {
    super(props);
    let tabs = [
      homePath('accountEdit'),
      homePath('accountEditAddress'),
      homePath('accountEditContact')
    ];

    if (this.props.context.user.is_sign_up_user) {
      tabs.push(homePath('accountEditPassword'));
    }

    let tabIndex = tabs.indexOf(this.props.location.pathname);
    this.state = {
      location: this.props.location.pathname,
      tabs: tabs,
      value: tabIndex !== -1 ? tabIndex : 0
    };
  }

  static getDerivedStateFromProps(props: any, state: IState) {
    if (props.location.pathname !== state.location.pathname) {
      let tabIndex = state.tabs.indexOf(props.location.pathname);
      if (tabIndex === -1) {
        props.history.push(state.tabs[0]);
      }

      return {
        ...state,
        location: props.location.pathname,
        value: tabIndex !== -1 ? tabIndex : 0
      };
    }

    return null;
  }

  render() {
    const { classes, t } = this.props;
    const { value } = this.state;
    return (
      <AppContext.Consumer>
        {(context: any) => (
          <React.Fragment>
            <HomeHelmet
              title={t('edit profile')}
              description={context.user.description}
              ogImage={context.user.user_info.avatar_large}
            />
            <div className={classes.root} id={'accountEdit'}>
              <Paper square>
                <Tabs
                  value={value}
                  onChange={(event, value) => {
                    this.setState({ value });
                  }}
                  indicatorColor="primary"
                  textColor="primary"
                  centered
                  scrollButtons="auto"
                  variant="fullWidth"
                >
                  <Tab
                    {...({
                      component: NavLink,
                      to: homePath('accountEdit')
                    } as any)}
                    label={t('info')}
                    icon={<InfoIcon />}
                  />
                  <Tab
                    {...({
                      component: NavLink,
                      to: homePath('accountEditAddress')
                    } as any)}
                    label={t('address')}
                    icon={<HomeIcon />}
                  />
                  <Tab
                    {...({
                      component: NavLink,
                      to: homePath('accountEditContact')
                    } as any)}
                    label={t('contact')}
                    icon={<PhoneIcon />}
                  />
                  {context.user.is_sign_up_user && (
                    <Tab
                      {...({
                        component: NavLink,
                        to: homePath('accountEditPassword')
                      } as any)}
                      label={t('password')}
                      icon={<LockIcon />}
                    />
                  )}
                </Tabs>
              </Paper>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                className={classes.tabContent}
              >
                <Fade in={value === 0}>
                  <Grid
                    item
                    xs={12}
                    sm={8}
                    md={6}
                    lg={4}
                    xl={3}
                    style={{ display: value === 0 ? 'inherit' : 'none' }}
                  >
                    {value === 0 && (
                      <Route
                        path={homePath('accountEdit')}
                        render={() => (
                          <FormEditUserAccount userId={context.user.id} />
                        )}
                      />
                    )}
                  </Grid>
                </Fade>
                <Fade in={value === 1}>
                  <Grid
                    item
                    xs={8}
                    sm={6}
                    md={4}
                    lg={4}
                    xl={4}
                    style={{ display: value === 1 ? 'inherit' : 'none' }}
                  >
                    {value === 1 && (
                      <Route
                        path={homePath('accountEditAddress')}
                        render={() => (
                          <FormEditUserAddress userId={context.user.id} />
                        )}
                      />
                    )}
                  </Grid>
                </Fade>
                <Fade in={value === 2}>
                  <Grid
                    item
                    xs={8}
                    sm={6}
                    md={4}
                    lg={4}
                    xl={4}
                    style={{ display: value === 2 ? 'inherit' : 'none' }}
                  >
                    {value === 2 && (
                      <Route
                        path={homePath('accountEditContact')}
                        render={() => (
                          <FormEditUserContact userId={context.user.id} />
                        )}
                      />
                    )}
                  </Grid>
                </Fade>
                {Boolean(context.user.is_sign_up_user) && (
                  <Fade in={value === 3}>
                    <Grid
                      item
                      xs={8}
                      sm={6}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{ display: value === 3 ? 'inherit' : 'none' }}
                    >
                      {value === 3 && (
                        <Route
                          path={homePath('accountEditPassword')}
                          render={() => (
                            <FormEditUserPassword userId={context.user.id} />
                          )}
                        />
                      )}
                    </Grid>
                  </Fade>
                )}
              </Grid>
            </div>
          </React.Fragment>
        )}
      </AppContext.Consumer>
    );
  }
}

export default withStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%'
  },
  tabContent: {
    marginTop: '35px'
  }
}))(withTranslation()(withRouter(AccountEdit)));
