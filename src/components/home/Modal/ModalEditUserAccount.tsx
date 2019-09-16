import Modal from '../../_modal/Modal';
import { withStyles } from '@material-ui/core/styles/index';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { AppContext } from '../../../contexts/home/Context';
import FormEditUserAccount from '../Form/FormEditUserAccount';

let t: (key: string) => string;

interface IProps {
  t: (key: string) => string;
  classes: any;
  isOpen: boolean;
  toggle: () => void;
}

interface IState {}

class ModalEditUserAccount extends React.Component<
  IProps & WithTranslation,
  IState
> {
  render() {
    const { classes, t, toggle, isOpen } = this.props;
    return (
      <AppContext.Consumer>
        {context => (
          <React.Fragment>
            <Modal open={isOpen} onClose={toggle} maxWidth={'sm'} fullWidth>
              <FormEditUserAccount
                userId={context.user.id}
                onUpdated={toggle}
                title={t('update your account')}
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
}))(withTranslation()(ModalEditUserAccount));
