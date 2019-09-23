import React from 'react';

import { OptionsObject, useSnackbar, WithSnackbarProps } from 'notistack';
import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';

interface UseToast extends WithSnackbarProps {
  toast: {
    success: (
      message: string,
      options?: OptionsObject
    ) => string | number | null;
    warning: (
      message: string,
      options?: OptionsObject
    ) => string | number | null;
    info: (message: string, options?: OptionsObject) => string | number | null;
    error: (message: string, options?: OptionsObject) => string | number | null;
    default: (
      message: string,
      options?: OptionsObject
    ) => string | number | null;
  };
}

const useToast: () => UseToast = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar(),
    { t } = useTranslation();

  function enqueue(
    message: string | React.ReactNode,
    options: OptionsObject = {}
  ) {
    // let action = (key: string | number) => (
    // 	<React.Fragment>
    // 		<Button
    // 			onClick={() => {
    // 				closeSnackbar(key)
    // 			}}
    // 			color={'inherit'}>
    // 			{t('close')}
    // 		</Button>
    // 	</React.Fragment>
    // );

    let action = (
      <Button color={'primary'} size="small">
        {t('close')}
      </Button>
    );

    return enqueueSnackbar(message, {
      ...{ action },
      ...options
    });
  }

  function defaultSnackbar(msg: string, options: OptionsObject = {}) {
    return enqueue(msg, {
      ...{ variant: 'default' },
      ...options
    });
  }

  function success(msg: string, options: OptionsObject = {}) {
    return enqueue(msg, {
      ...{ variant: 'success' },
      ...options
    });
  }

  function warning(msg: string, options: OptionsObject = {}) {
    return enqueue(msg, {
      ...{ variant: 'warning' },
      ...options
    });
  }

  function info(msg: string, options: OptionsObject = {}) {
    return enqueue(msg, {
      ...{ variant: 'info' },
      ...options
    });
  }

  function error(msg: string, options: OptionsObject = {}) {
    return enqueue(msg, {
      ...{
        variant: 'error',
        autoHideDuration: 5000
      },
      ...options
    });
  }

  return {
    enqueueSnackbar: enqueue,
    closeSnackbar,
    toast: {
      success,
      warning,
      info,
      error,
      default: defaultSnackbar
    }
  };
};

export default useToast;
