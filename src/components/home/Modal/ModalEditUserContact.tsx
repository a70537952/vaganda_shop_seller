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
import FormEditUserContact from '../Form/FormEditUserContact';

let t: (key: string) => string;

interface IProps {
  t: (key: string) => string;
  classes: any;
  isOpen: boolean;
  toggle: () => void;
}

interface IState {}

class ModalEditUserContact extends React.Component<
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
              <FormEditUserContact
                userId={context.user.id}
                onUpdated={toggle}
                title={t('update your contact')}
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
}))(withSnackbar(withTranslation()(withRouter(ModalEditUserContact))));
