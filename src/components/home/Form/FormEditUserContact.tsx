import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Theme } from '@material-ui/core/styles/index';
import TextField from '@material-ui/core/TextField';
import DoneIcon from '@material-ui/icons/Done';
import EmailIcon from '@material-ui/icons/Email';
import update from 'immutability-helper';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import CountryPhoneCodeSelect from '../../_select/CountryPhoneCodeSelect';
import FormUtil, { Fields } from '../../../utils/FormUtil';
import blue from '@material-ui/core/colors/blue';
import FormHelperText from '@material-ui/core/FormHelperText';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { useUserQuery } from '../../../graphql/query/UserQuery';
import { useUpdateUserContactMutation } from '../../../graphql/mutation/userMutation/UpdateUserContactMutation';
import { IUserFragmentFormEditUserContact } from '../../../graphql/fragment/interface/UserFragmentInterface';
import { userFragments } from '../../../graphql/fragment/query/UserFragment';

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

export default function FormEditUserContact(props: IProps) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let updateUserContactFields = [
    { field: 'is_sign_up_user', value: '' },
    { field: 'email_verified_at', value: '' },
    { field: 'email', value: '' },
    { field: 'phoneCountryCode', value: '' },
    { field: 'phone', value: '' }
  ];

  const [
    updateUserContactMutation,
    { loading: isUpdatingUserContactMutation }
  ] = useUpdateUserContactMutation(userFragments.FormEditUserContact, {
    onCompleted: data => {
      setUpdateUserContact(
        FormUtil.resetFieldsIsValidHook(
          updateUserContactFields,
          updateUserContact
        )
      );
      enqueueSnackbar(t('your contact has been successfully updated'));
      if (props.onUpdated) {
        props.onUpdated();
      }
    },
    onError: error => {
      setUpdateUserContact(
        FormUtil.validationErrorHandlerHook(
          updateUserContactFields,
          error,
          updateUserContact
        ).state
      );
    }
  });

  const { loading, data } = useUserQuery<IUserFragmentFormEditUserContact>(
    userFragments.FormEditUserContact,
    {
      fetchPolicy: 'no-cache',
      onCompleted: data => {
        let newUser = data.user.items[0];
        setUpdateUserContact(
          update(updateUserContact, {
            is_sign_up_user: { value: { $set: newUser.is_sign_up_user } },
            email_verified_at: { value: { $set: newUser.email_verified_at } },
            email: { value: { $set: newUser.email || '' } },
            phoneCountryCode: {
              value: { $set: newUser.user_info.phone_country_code || '' }
            },
            phone: { value: { $set: newUser.user_info.phone || '' } }
          })
        );
      }
    }
  );

  const [updateUserContact, setUpdateUserContact] = useState<Fields>(
    FormUtil.generateFieldsState(updateUserContactFields)
  );

  function onClickUpdateUserContact() {
    updateUserContactMutation({
      variables: {
        phoneCountryCode: updateUserContact.phoneCountryCode.value,
        phone: updateUserContact.phone.value
      }
    });
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
      {!loading ? (
        <>
          {Boolean(updateUserContact.is_sign_up_user.value) && (
            <Grid item xs={12}>
              <TextField
                disabled
                error={!updateUserContact.email.is_valid}
                label={t('email')}
                value={updateUserContact.email.value}
                onChange={(e: { target: { value: any } }) => {
                  setUpdateUserContact(
                    update(updateUserContact, {
                      email: {
                        value: { $set: e.target.value }
                      }
                    })
                  );
                }}
                helperText={updateUserContact.email.feedback}
                margin="normal"
                fullWidth
              />
              <FormHelperText error={false}>
                {t(
                  'your email address will be used to receive notification, reset password, receive order invoice and etc'
                )}
              </FormHelperText>
              <FormHelperText error={false}>
                {t(
                  'if you update your email address, you will need to verify your new email address'
                )}
              </FormHelperText>
            </Grid>
          )}
        </>
      ) : (
        <Grid item xs={12}>
          <Skeleton height={50} />
        </Grid>
      )}
      {!loading &&
        Boolean(updateUserContact.is_sign_up_user.value) &&
        updateUserContact.email.value &&
        updateUserContact.email_verified_at.value && (
          <Grid item xs={12}>
            <Chip
              className={classes.emailVerifiedChip}
              icon={<EmailIcon />}
              label={t('email verified')}
              color="primary"
              onDelete={() => {}}
              deleteIcon={<DoneIcon />}
            />
          </Grid>
        )}
      <Grid item xs={12} sm={12} md={6}>
        {!loading ? (
          <CountryPhoneCodeSelect
            error={!updateUserContact.phoneCountryCode.is_valid}
            helperText={updateUserContact.phoneCountryCode.feedback}
            value={updateUserContact.phoneCountryCode.value}
            onChange={(value: unknown) => {
              setUpdateUserContact(
                update(updateUserContact, {
                  phoneCountryCode: {
                    value: { $set: value }
                  }
                })
              );
            }}
            margin="normal"
            fullWidth
          />
        ) : (
          <Skeleton height={50} />
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        {!loading ? (
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {updateUserContact.phoneCountryCode.value}
                </InputAdornment>
              )
            }}
            error={!updateUserContact.phone.is_valid}
            label={t('phone')}
            value={updateUserContact.phone.value}
            onChange={(e: { target: { value: any } }) => {
              setUpdateUserContact(
                update(updateUserContact, {
                  phone: {
                    value: { $set: e.target.value }
                  }
                })
              );
            }}
            helperText={updateUserContact.phone.feedback}
            margin="normal"
            fullWidth
          />
        ) : (
          <Skeleton height={50} />
        )}
      </Grid>
      <Grid container item justify="flex-end">
        {!loading ? (
          <>
            {isUpdatingUserContactMutation ? (
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
                onClick={onClickUpdateUserContact}
              >
                {t('update')}
              </Button>
            )}
          </>
        ) : (
          <Skeleton variant={'rect'} height={50} width={100} />
        )}
      </Grid>
    </Grid>
  );
}
