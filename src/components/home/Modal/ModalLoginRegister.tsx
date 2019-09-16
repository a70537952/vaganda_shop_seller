import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Modal from '../../_modal/Modal';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles/index';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { AppContext } from '../../../contexts/home/Context';
import FormForgotPassword from '../Form/FormForgotPassword';
import FormSignIn from '../Form/FormSignIn';
import FormSignUp from '../Form/FormSignUp';
import { RouteComponentProps } from 'react-router';

let t: (key: string) => string;

interface IProps {
  t: (key: string) => string;
  classes: any;
  isOpen: boolean;
  toggle: () => void;
}

interface IState {
  current: string;
}

class ModalLoginRegister extends React.Component<
  IProps & RouteComponentProps & WithTranslation & WithSnackbarProps,
  IState
> {
  constructor(
    props: IProps & RouteComponentProps & WithTranslation & WithSnackbarProps
  ) {
    super(props);
    t = this.props.t;
    this.state = {
      current: 'login'
    };
  }

  render() {
    const { classes, t } = this.props;
    return (
      <AppContext.Consumer>
        {context => (
          <React.Fragment>
            <Modal
              closeAfterTransition
              disableAutoFocus
              open={this.props.isOpen}
              onClose={this.props.toggle}
              maxWidth={'sm'}
              fullWidth
            >
              {this.state.current === 'login' && (
                <Fade in={this.state.current === 'login'} timeout={400}>
                  <Grid container item justify={'center'}>
                    <FormSignIn
                      onSignUpClick={() => {
                        this.setState({ current: 'sign up' });
                      }}
                      onForgotPasswordClick={() => {
                        this.setState({ current: 'forgot password' });
                      }}
                    />
                  </Grid>
                </Fade>
              )}
              {this.state.current === 'sign up' && (
                <Fade in={this.state.current === 'sign up'} timeout={400}>
                  <Grid container item justify={'center'}>
                    <FormSignUp
                      onLoginClick={() => {
                        this.setState({ current: 'login' });
                      }}
                    />
                  </Grid>
                </Fade>
              )}
              {this.state.current === 'forgot password' && (
                <Fade
                  in={this.state.current === 'forgot password'}
                  timeout={400}
                >
                  <Grid container item justify={'center'}>
                    <FormForgotPassword
                      onLoginClick={() => {
                        this.setState({ current: 'login' });
                      }}
                    />
                  </Grid>
                </Fade>
              )}
            </Modal>
          </React.Fragment>
        )}
      </AppContext.Consumer>
    );
  }
}

export default withStyles(theme => ({
  content: {
    margin: 0
  }
}))(withSnackbar(withTranslation()(withRouter(ModalLoginRegister))));
