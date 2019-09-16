import Grid from '@material-ui/core/Grid';
import Modal from '../../_modal/Modal';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles/index';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { AppContext } from '../../../contexts/home/Context';
import { RouteComponentProps } from 'react-router';
import FormEditUserAddress from '../Form/FormEditUserAddress';
import FormEditUserAccount from '../Form/FormEditUserAccount';

let t: (key: string) => string;

interface IProps {
  t: (key: string) => string;
  classes: any;
  isOpen: boolean;
  toggle: () => void;
}

interface IState {}

class ModalEditUserAddress extends React.Component<
  IProps & RouteComponentProps & WithTranslation & WithSnackbarProps,
  IState
> {
  render() {
    const { classes, t, toggle, isOpen } = this.props;
    return (
      <AppContext.Consumer>
        {context => (
          <React.Fragment>
            <Modal open={isOpen} onClose={toggle} maxWidth={'sm'} fullWidth>
              <FormEditUserAddress
                userId={context.user.id}
                title={t('update your address')}
                onUpdated={toggle}
                className={classes.content}
              />
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
}))(withSnackbar(withTranslation()(withRouter(ModalEditUserAddress))));
