import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { Theme } from '@material-ui/core/styles/index';
import TextField from '@material-ui/core/TextField';
import update from 'immutability-helper';
import { useSnackbar } from 'notistack';
import React, { useContext, useState } from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { AppContext } from '../../../contexts/home/Context';
import FormUtil, { Fields } from '../../../utils/FormUtil';
import UserAvatar from '../../UserAvatar';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { useUserQuery } from '../../../graphql/query/UserQuery';
import { useUpdateUserInfoMutation } from '../../../graphql/mutation/userMutation/UpdateUserInfoMutation';
import { useChangeUserAvatarMutation } from '../../../graphql/mutation/userMutation/ChangeUserAvatarMutation';
import { useRemoveUserAvatarMutation } from '../../../graphql/mutation/userMutation/RemoveUserAvatarMutation';
import { IUserFragmentFormEditUserAccount } from '../../../graphql/fragment/interface/UserFragmentInterface';
import { userFragments } from '../../../graphql/fragment/query/UserFragment';

interface IProps {
  userId: string;
  title?: string;
  onUpdated?: () => void;
  className?: any;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  inputUploadAvatar: {
    display: 'none'
  },
  imgUploadAvatar: {
    width: 60,
    height: 60,
    margin: theme.spacing(1)
  },
  btnChangeAvatar: {
    margin: theme.spacing(1)
  },
  btnRemoveAvatar: {
    margin: theme.spacing(1)
  },
  buttonUpdateProgress: {
    color: '#fff'
  }
}));

export default function FormEditUserAccount(props: IProps) {
  const classes = useStyles();
  const context = useContext(AppContext);
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let updateUserInfoFields = [
    { field: 'username' },
    { field: 'name', isCheckEmpty: true, emptyMessage: t('please enter name') },
    { field: 'gender' }
  ];

  const [
    updateUserInfoMutation,
    { loading: isUpdatingUserInfoMutation }
  ] = useUpdateUserInfoMutation(userFragments.FormEditUserAccount, {
    onCompleted: data => {
      setUpdateUserInfo(
        FormUtil.resetFieldsIsValidHook(updateUserInfoFields, updateUserInfo)
      );
      enqueueSnackbar(t('your profile has been successfully updated'));
      if (props.onUpdated) {
        props.onUpdated();
      }
      context.getContext();
    },
    onError: error => {
      setUpdateUserInfo(
        FormUtil.validationErrorHandlerHook(
          updateUserInfoFields,
          error,
          updateUserInfo
        ).state
      );
    }
  });
  const [
    changeUserAvatarMutation,
    { loading: isChangingUserAvatarMutation }
  ] = useChangeUserAvatarMutation(userFragments.FormEditUserAccount, {
    onCompleted: data => {
      context.getContext();
    },
    onError: error => {
      let errorMessage = FormUtil.getValidationErrorByField(
        'userAvatar',
        error
      );
      enqueueSnackbar(errorMessage, {
        variant: 'error'
      });
    }
  });
  const [removeUserAvatarMutation] = useRemoveUserAvatarMutation(
    userFragments.FormEditUserAccount,
    {
      onCompleted: data => {
        context.getContext();
      }
    }
  );

  const { loading, data } = useUserQuery<IUserFragmentFormEditUserAccount>(
    userFragments.FormEditUserAccount,
    {
      fetchPolicy: 'no-cache',
      onCompleted: data => {
        let newUser = data.user.items[0];
        setUpdateUserInfo(
          update(updateUserInfo, {
            username: {
              value: { $set: newUser.username || '' }
            },
            name: {
              value: { $set: newUser.name || '' }
            },
            gender: {
              value: { $set: newUser.user_info.gender || '' }
            }
          })
        );
      }
    }
  );

  const [updateUserInfo, setUpdateUserInfo] = useState<Fields>(
    FormUtil.generateFieldsState(updateUserInfoFields)
  );

  function onClickUpdateUserInfo() {
    let { state, isValid } = FormUtil.generateFieldsEmptyErrorHook(
      updateUserInfoFields,
      updateUserInfo
    );

    setUpdateUserInfo(state);

    if (isValid) {
      updateUserInfoMutation({
        variables: {
          name: updateUserInfo.name.value,
          gender:
            updateUserInfo.gender.value === ''
              ? null
              : updateUserInfo.gender.value
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
      <Grid
        container
        item
        direction="row"
        justify="center"
        alignItems="center"
        xs={12}
      >
        {!loading ? (
          <>
            {isChangingUserAvatarMutation ? (
              <CircularProgress className={classes.imgUploadAvatar} />
            ) : (
              <UserAvatar
                user={context.user}
                className={classes.imgUploadAvatar}
              />
            )}
          </>
        ) : (
          <Grid className={classes.imgUploadAvatar}>
            <Skeleton variant={'circle'} height={60} width={60} />
          </Grid>
        )}
        {!loading ? (
          <>
            <input
              multiple={false}
              onChange={e => {
                if (e.target.files) {
                  changeUserAvatarMutation({
                    variables: {
                      userAvatar: e.target.files[0]
                    }
                  });
                }
                e.target.value = '';
              }}
              id="changeAvatarImage"
              accept="image/*"
              type="file"
              className={classes.inputUploadAvatar}
            />
            <label className="label-upload" htmlFor="changeAvatarImage">
              <Button
                className={classes.btnChangeAvatar}
                size="small"
                variant="outlined"
                component="span"
                color="primary"
              >
                {t('change avatar')}
              </Button>
            </label>

            {context.user.user_info.avatar !== null && (
              <label
                onClick={e => {
                  removeUserAvatarMutation();
                }}
              >
                <Button
                  className={classes.btnRemoveAvatar}
                  size="small"
                  variant="outlined"
                  color="primary"
                >
                  {t('remove avatar')}
                </Button>
              </label>
            )}
          </>
        ) : (
          <>
            <Grid className={classes.btnChangeAvatar}>
              <Skeleton variant={'rect'} height={40} width={130} />
            </Grid>
            <Grid className={classes.btnChangeAvatar}>
              <Skeleton variant={'rect'} height={40} width={130} />
            </Grid>
          </>
        )}
      </Grid>
      <Grid item xs={10}>
        {!loading ? (
          <TextField
            disabled={true}
            error={!updateUserInfo.username.is_valid}
            label={t('username')}
            value={updateUserInfo.username.value}
            helperText={updateUserInfo.username.feedback}
            margin="normal"
            fullWidth
          />
        ) : (
          <Skeleton height={50} />
        )}
      </Grid>
      <Grid item xs={10}>
        {!loading ? (
          <TextField
            error={!updateUserInfo.name.is_valid}
            label={t('name')}
            value={updateUserInfo.name.value}
            onChange={(e: { target: { value: any } }) => {
              setUpdateUserInfo(
                update(updateUserInfo, {
                  name: {
                    value: { $set: e.target.value }
                  }
                })
              );
            }}
            helperText={updateUserInfo.name.feedback}
            margin="normal"
            fullWidth
          />
        ) : (
          <Skeleton height={50} />
        )}
      </Grid>
      <Grid item xs={10}>
        {!loading ? (
          <FormControl fullWidth error={!updateUserInfo.gender.is_valid}>
            <InputLabel htmlFor="gender">{t('gender')}</InputLabel>
            <Select
              value={updateUserInfo.gender.value}
              onChange={(e: { target: { value: any } }) => {
                setUpdateUserInfo(
                  update(updateUserInfo, {
                    gender: {
                      value: { $set: e.target.value }
                    }
                  })
                );
              }}
              inputProps={{
                name: 'gender',
                id: 'gender'
              }}
            >
              <MenuItem value="">
                <em>{t('unspecified')}</em>
              </MenuItem>
              <MenuItem value={1}>{t('male')}</MenuItem>
              <MenuItem value={0}>{t('female')}</MenuItem>
            </Select>
            <FormHelperText>{updateUserInfo.gender.feedback}</FormHelperText>
          </FormControl>
        ) : (
          <Skeleton height={50} />
        )}
      </Grid>
      <Grid container item justify="flex-end">
        {!loading ? (
          <>
            {isUpdatingUserInfoMutation ? (
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
                onClick={onClickUpdateUserInfo}
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
