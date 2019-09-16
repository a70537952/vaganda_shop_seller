import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import HomeIcon from '@material-ui/icons/Home';
import DoneIcon from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Cancel';
import React from 'react';
import { NavLink, Route, withRouter } from 'react-router-dom';
import HomeHelmet from '../../components/home/HomeHelmet';
import { AppContext } from '../../contexts/home/Context';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import { homePath } from '../../utils/RouteUtil';
import UserOrderDetailList from '../../components/home/UserOrder/UserOrderDetailList';
import USER_ORDER_DETAIL from '../../constant/USER_ORDER_DETAIL';

interface IProps {
  classes: any;
  context: any;
}

interface IState {
  location: any;
  tabs: string[];
  value: number;
}

export class MyOrder extends React.Component<
  IProps & RouteComponentProps & WithTranslation,
  IState
> {
  constructor(props: IProps & RouteComponentProps & WithTranslation) {
    super(props);
    let tabs = [
      homePath('myOrderShip'),
      homePath('myOrderReceive'),
      homePath('myOrderComplete'),
      homePath('myOrderCancel')
    ];

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
            <HomeHelmet title={t('my order')} description={t('my order')} />
            <div className={classes.root}>
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
                      to: homePath('myOrderShip')
                    } as any)}
                    label={t('to ship')}
                    icon={<LocalShippingIcon />}
                  />
                  <Tab
                    {...({
                      component: NavLink,
                      to: homePath('myOrderReceive')
                    } as any)}
                    label={t('to receive')}
                    icon={<HomeIcon />}
                  />
                  <Tab
                    {...({
                      component: NavLink,
                      to: homePath('myOrderComplete')
                    } as any)}
                    label={t('completed')}
                    icon={<DoneIcon />}
                  />
                  {context.user.is_sign_up_user && (
                    <Tab
                      {...({
                        component: NavLink,
                        to: homePath('myOrderCancel')
                      } as any)}
                      label={t('cancelled')}
                      icon={<CancelIcon />}
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
                    container
                    item
                    xs={12}
                    md={10}
                    justify="center"
                    style={{ display: value === 0 ? 'inherit' : 'none' }}
                  >
                    <Route
                      path={homePath('myOrderShip')}
                      render={() => (
                        <UserOrderDetailList
                          variables={{
                            user_id: context.user.id,
                            order_detail_status:
                              USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.PAID
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Fade>
                <Fade in={value === 1}>
                  <Grid
                    container
                    item
                    xs={12}
                    md={10}
                    justify="center"
                    style={{ display: value === 1 ? 'inherit' : 'none' }}
                  >
                    {value === 1 && (
                      <UserOrderDetailList
                        variables={{
                          user_id: context.user.id,
                          order_detail_status:
                            USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.SHIPPED
                        }}
                      />
                    )}
                  </Grid>
                </Fade>
                <Fade in={value === 2}>
                  <Grid
                    container
                    item
                    xs={12}
                    md={10}
                    justify="center"
                    style={{ display: value === 2 ? 'inherit' : 'none' }}
                  >
                    {value === 2 && (
                      <UserOrderDetailList
                        variables={{
                          user_id: context.user.id,
                          order_detail_status:
                            USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.RECEIVED
                        }}
                      />
                    )}
                  </Grid>
                </Fade>
                {Boolean(context.user.is_sign_up_user) && (
                  <Fade in={value === 3}>
                    <Grid
                      container
                      item
                      xs={12}
                      md={10}
                      justify="center"
                      style={{ display: value === 3 ? 'inherit' : 'none' }}
                    >
                      {value === 3 && (
                        <UserOrderDetailList
                          variables={{
                            user_id: context.user.id,
                            order_detail_status:
                              USER_ORDER_DETAIL.ORDER_DETAIL_STATUS.CANCELLED
                          }}
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
}))(withTranslation()(withRouter(MyOrder)));
