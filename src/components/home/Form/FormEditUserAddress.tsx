import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { Theme } from '@material-ui/core/styles/index';
import TextField from '@material-ui/core/TextField';
import update from 'immutability-helper';
import { useSnackbar } from 'notistack';
import React, { useContext, useState } from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { AppContext } from '../../../contexts/home/Context';
import CountrySelect from '../../_select/CountrySelect';
import FormUtil, { Fields } from '../../../utils/FormUtil';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { useUserQuery } from '../../../graphql/query/UserQuery';
import { makeStyles } from '@material-ui/styles';
import { useUpdateUserAddressMutation } from '../../../graphql/mutation/userMutation/UpdateUserAddressMutation';
import { useUserAddressQuery } from '../../../graphql/query/UserAddressQuery';
import { IUserAddressFragmentFormEditUserAddress } from '../../../graphql/fragment/interface/UserAddressFragmentInterface';
import { userAddressFragments } from '../../../graphql/fragment/query/UserAddressFragment';
import { userFragments } from '../../../graphql/fragment/query/UserFragment';

interface IProps {
  userId: string;
  title?: string;
  onUpdated?: () => void;
  className?: any;
}

const useStyles = makeStyles((theme: Theme) => ({
  buttonUpdateProgress: {
    color: '#fff'
  },
  buttonUpdate: {
    marginTop: theme.spacing(1)
  }
}));

export default function FormEditUserAddress(props: IProps) {
  const classes = useStyles();
  const context = useContext(AppContext);
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let updateUserAddressFields = [
    { field: 'address_1', value: '' },
    { field: 'address_2', value: '' },
    { field: 'address_3', value: '' },
    { field: 'city', value: '' },
    { field: 'state', value: '' },
    { field: 'postal_code', value: '' },
    { field: 'country', value: '' }
  ];

  const [
    updateUserAddressMutation,
    { loading: isUpdatingUserAddressMutation }
  ] = useUpdateUserAddressMutation(userAddressFragments.FormEditUserAddress, {
    onCompleted: data => {
      setUpdateUserAddress(
        FormUtil.resetFieldsIsValidHook(
          updateUserAddressFields,
          updateUserAddress
        )
      );
      enqueueSnackbar(t('your address has been successfully updated'));
      if (props.onUpdated) {
        props.onUpdated();
      }
      context.getContext();
    },
    onError: error => {
      setUpdateUserAddress(
        FormUtil.validationErrorHandlerHook(
          updateUserAddressFields,
          error,
          updateUserAddress
        ).state
      );
    }
  });

  const { loading, data } = useUserAddressQuery<
    IUserAddressFragmentFormEditUserAddress
  >(userAddressFragments.FormEditUserAddress, {
    fetchPolicy: 'no-cache',
    onCompleted: data => {
      let newUserAddress = data.userAddress.items[0];
      setUpdateUserAddress(
        update(updateUserAddress, {
          address_1: { value: { $set: newUserAddress.address_1 || '' } },
          address_2: { value: { $set: newUserAddress.address_2 || '' } },
          address_3: { value: { $set: newUserAddress.address_3 || '' } },
          city: { value: { $set: newUserAddress.city || '' } },
          state: { value: { $set: newUserAddress.state || '' } },
          postal_code: { value: { $set: newUserAddress.postal_code || '' } },
          country: { value: { $set: newUserAddress.country || '' } }
        })
      );
    }
  });

  const [updateUserAddress, setUpdateUserAddress] = useState<Fields>(
    FormUtil.generateFieldsState(updateUserAddressFields)
  );

  function onClickUpdateUserAddress() {
    updateUserAddressMutation({
      variables: {
        address_1: updateUserAddress.address_1.value,
        address_2: updateUserAddress.address_2.value,
        address_3: updateUserAddress.address_3.value,
        city: updateUserAddress.city.value,
        state: updateUserAddress.state.value,
        postal_code: updateUserAddress.postal_code.value,
        country: updateUserAddress.country.value
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
      spacing={3}
      className={className}
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
        {!loading ? (
          <TextField
            error={!updateUserAddress.address_1.is_valid}
            label={t('address 1')}
            value={updateUserAddress.address_1.value}
            onChange={(e: { target: { value: any } }) => {
              setUpdateUserAddress(
                update(updateUserAddress, {
                  address_1: {
                    value: { $set: e.target.value }
                  }
                })
              );
            }}
            helperText={updateUserAddress.address_1.feedback}
            margin="normal"
            fullWidth
          />
        ) : (
          <Skeleton height={50} />
        )}
      </Grid>
      <Grid item xs={12}>
        {!loading ? (
          <TextField
            error={!updateUserAddress.address_2.is_valid}
            label={t('address 2')}
            value={updateUserAddress.address_2.value}
            onChange={(e: { target: { value: any } }) => {
              setUpdateUserAddress(
                update(updateUserAddress, {
                  address_2: {
                    value: { $set: e.target.value }
                  }
                })
              );
            }}
            helperText={updateUserAddress.address_2.feedback}
            margin="normal"
            fullWidth
          />
        ) : (
          <Skeleton height={50} />
        )}
      </Grid>
      <Grid item xs={12}>
        {!loading ? (
          <TextField
            error={!updateUserAddress.address_3.is_valid}
            label={t('address 3')}
            value={updateUserAddress.address_3.value}
            onChange={(e: { target: { value: any } }) => {
              setUpdateUserAddress(
                update(updateUserAddress, {
                  address_3: {
                    value: { $set: e.target.value }
                  }
                })
              );
            }}
            helperText={updateUserAddress.address_3.feedback}
            margin="normal"
            fullWidth
          />
        ) : (
          <Skeleton height={50} />
        )}
      </Grid>

      <Grid item xs={12} sm={6}>
        {!loading ? (
          <TextField
            error={!updateUserAddress.city.is_valid}
            label={t('city')}
            value={updateUserAddress.city.value}
            onChange={(e: { target: { value: any } }) => {
              setUpdateUserAddress(
                update(updateUserAddress, {
                  city: {
                    value: { $set: e.target.value }
                  }
                })
              );
            }}
            helperText={updateUserAddress.city.feedback}
            margin="normal"
            fullWidth
          />
        ) : (
          <Skeleton height={50} />
        )}
      </Grid>
      <Grid item xs={12} sm={6}>
        {!loading ? (
          <TextField
            error={!updateUserAddress.state.is_valid}
            label={t('state')}
            value={updateUserAddress.state.value}
            onChange={(e: { target: { value: any } }) => {
              setUpdateUserAddress(
                update(updateUserAddress, {
                  state: {
                    value: { $set: e.target.value }
                  }
                })
              );
            }}
            helperText={updateUserAddress.state.feedback}
            margin="normal"
            fullWidth
          />
        ) : (
          <Skeleton height={50} />
        )}
      </Grid>

      <Grid item xs={12} sm={6}>
        {!loading ? (
          <TextField
            error={!updateUserAddress.postal_code.is_valid}
            label={t('postal code')}
            value={updateUserAddress.postal_code.value}
            onChange={(e: { target: { value: any } }) => {
              setUpdateUserAddress(
                update(updateUserAddress, {
                  postal_code: {
                    value: { $set: e.target.value }
                  }
                })
              );
            }}
            helperText={updateUserAddress.postal_code.feedback}
            margin="normal"
            fullWidth
          />
        ) : (
          <Skeleton height={50} />
        )}
      </Grid>
      <Grid item xs={12} sm={6}>
        {!loading ? (
          <CountrySelect
            label={t('country')}
            error={!updateUserAddress.country.is_valid}
            helperText={updateUserAddress.country.feedback}
            value={updateUserAddress.country.value}
            onChange={(value: unknown) => {
              setUpdateUserAddress(
                update(updateUserAddress, {
                  country: {
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
      <Grid container item justify="flex-end">
        {!loading ? (
          <>
            {isUpdatingUserAddressMutation ? (
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
                className={classes.buttonUpdate}
                onClick={onClickUpdateUserAddress}
              >
                {t('update')}
              </Button>
            )}
          </>
        ) : (
          <Skeleton variant={'rect'} width={150} height={50} />
        )}
      </Grid>
    </Grid>
  );
}
