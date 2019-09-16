import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { Theme } from '@material-ui/core/styles/index';
import TextField from '@material-ui/core/TextField';
import update from 'immutability-helper';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import FormUtil, { Fields } from '../../../utils/FormUtil';
import blue from '@material-ui/core/colors/blue';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { useUpdateUserPasswordMutation } from '../../../graphql/mutation/userMutation/UpdateUserPasswordMutation';
import { updateUserPasswordMutationFragments } from '../../../graphql/fragment/mutation/UpdateUserPasswordMutationFragment';

interface IProps {
  userId: string;
  title?: string;
  onUpdated?: () => void;
  className?: any;
}

const useStyles = makeStyles((theme: Theme) => ({
  textFieldName: {
    minWidth: 230
  },
  buttonUpdateProgress: {
    color: '#fff'
  },
  emailVerifiedChip: {
    width: '100%'
  },
  emailUnverifiedChip: {
    width: '100%',
    backgroundColor: blue[500],
    '&:hover': {
      backgroundColor: blue[700]
    }
  }
}));

export default function FormEditUserPassword(props: IProps) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let updateUserPasswordFields = [
    {
      field: 'currentPassword',
      value: '',
      isCheckEmpty: true,
      emptyMessage: t('please enter your current password')
    },
    {
      field: 'newPassword',
      value: '',
      isCheckEmpty: true,
      emptyMessage: t('please enter your new password')
    },
    {
      field: 'confirmPassword',
      value: '',
      isCheckEmpty: true,
      emptyMessage: t('please enter your confirm password')
    }
  ];

  const [
    updateUserPasswordMutation,
    { loading: isUpdatingUserPasswordMutation }
  ] = useUpdateUserPasswordMutation(
    updateUserPasswordMutationFragments.DefaultFragment,
    {
      onCompleted: data => {
        setUpdateUserPassword(
          FormUtil.generateResetFieldsStateHook(
            updateUserPasswordFields,
            updateUserPassword
          )
        );
        enqueueSnackbar(t('your password has been successfully updated'));
        if (props.onUpdated) {
          props.onUpdated();
        }
      },
      onError: error => {
        setUpdateUserPassword(
          FormUtil.validationErrorHandlerHook(
            updateUserPasswordFields,
            error,
            updateUserPassword
          ).state
        );
      }
    }
  );

  const [updateUserPassword, setUpdateUserPassword] = useState<Fields>(
    FormUtil.generateFieldsState(updateUserPasswordFields)
  );

  function onClickUpdateUserPassword() {
    let { state, isValid } = FormUtil.generateFieldsEmptyErrorHook(
      updateUserPasswordFields,
      updateUserPassword
    );

    setUpdateUserPassword(state);

    let isConfirmPasswordValid = true;

    if (
      updateUserPassword.newPassword.value !==
      updateUserPassword.confirmPassword.value
    ) {
      isConfirmPasswordValid = false;
      setUpdateUserPassword(
        update(updateUserPassword, {
          confirmPassword: {
            feedback: {
              $set: t('confirm password does not match new password')
            },
            is_valid: { $set: false }
          }
        })
      );
    }

    if (isValid && isConfirmPasswordValid) {
      updateUserPasswordMutation({
        variables: {
          currentPassword: updateUserPassword.currentPassword.value,
          newPassword: updateUserPassword.newPassword.value
        }
      });
    }
  }

  const { title, className } = props;

  return (
    <Grid
      container
      item
      direction="row"
      justify="center"
      alignItems="center"
      xs={12}
      className={className}
      spacing={3}
    >
      {title && (
        <Grid item xs={12}>
          <Typography
            component="p"
            variant="h6"
            color="inherit"
            align="center"
            style={{ textTransform: 'capitalize' }}
          >
            {title}
          </Typography>
        </Grid>
      )}
      <Grid item xs={12}>
        <TextField
          type="password"
          error={!updateUserPassword.currentPassword.is_valid}
          label={t('current password')}
          value={updateUserPassword.currentPassword.value}
          onChange={(e: { target: { value: any } }) => {
            setUpdateUserPassword(
              update(updateUserPassword, {
                currentPassword: {
                  value: { $set: e.target.value }
                }
              })
            );
          }}
          helperText={updateUserPassword.currentPassword.feedback}
          margin="normal"
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="password"
          error={!updateUserPassword.newPassword.is_valid}
          label={t('new password')}
          value={updateUserPassword.newPassword.value}
          onChange={(e: { target: { value: any } }) => {
            setUpdateUserPassword(
              update(updateUserPassword, {
                newPassword: {
                  value: { $set: e.target.value }
                }
              })
            );
          }}
          helperText={updateUserPassword.newPassword.feedback}
          margin="normal"
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="password"
          error={!updateUserPassword.confirmPassword.is_valid}
          label={t('confirm password')}
          value={updateUserPassword.confirmPassword.value}
          onChange={(e: { target: { value: any } }) => {
            setUpdateUserPassword(
              update(updateUserPassword, {
                confirmPassword: {
                  value: { $set: e.target.value }
                }
              })
            );
          }}
          helperText={updateUserPassword.confirmPassword.feedback}
          margin="normal"
          fullWidth
        />
      </Grid>

      <Grid container item justify="flex-end">
        {isUpdatingUserPasswordMutation ? (
          <Button variant="contained" color="primary">
            <CircularProgress
              size={20}
              className={classes.buttonUpdateProgress}
            />
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={onClickUpdateUserPassword}
          >
            {t('update')}
          </Button>
        )}
      </Grid>
    </Grid>
  );
}
