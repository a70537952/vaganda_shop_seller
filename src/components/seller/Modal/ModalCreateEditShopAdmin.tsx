import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Modal from "../../_modal/Modal";
import Paper from "@material-ui/core/Paper";
import { makeStyles, Theme } from "@material-ui/core/styles/index";
import React, { useContext, useEffect, useState } from "react";
import { useApolloClient } from "react-apollo";
import Skeleton from "@material-ui/lab/Skeleton";
import { AppContext } from "../../../contexts/Context";
import { useTranslation } from "react-i18next";
import Autosuggest from "react-autosuggest";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import FormHelperText from "@material-ui/core/FormHelperText";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import UserAvatar from "../../../components/UserAvatar";
import ShopAdminRoleSelect from "../../_select/ShopAdminRoleSelect";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import { shopAdminFragments } from "../../../graphql/fragment/query/ShopAdminFragment";
import { WithPagination } from "../../../graphql/query/Query";
import useToast from "../../_hook/useToast";
import { shopAdminQuery, ShopAdminVars } from "../../../graphql/query/ShopAdminQuery";
import { IShopAdminFragmentModalCreateEditShopAdmin } from "../../../graphql/fragmentType/query/ShopAdminFragmentInterface";
import { useCreateShopAdminMutation } from "../../../graphql/mutation/shopAdminMutation/CreateShopAdminMutation";
import { useEditShopAdminMutation } from "../../../graphql/mutation/shopAdminMutation/EditShopAdminMutation";
import useForm from "../../_hook/useForm";
import DialogConfirm from "../../_dialog/DialogConfirm";
import ButtonSubmit from "../../ButtonSubmit";
import { useUserLazyQuery } from "../../../graphql/query/UserQuery";
import { userFragments } from "../../../graphql/fragment/query/UserFragment";
import { IUserFragmentModalCreateEditShopAdmin } from "../../../graphql/fragmentType/query/UserFragmentInterface";
import LoadingSkeleton from "../../LoadingSkeleton";

interface IProps {
  shopAdminId?: string;
  shopId: string;
  disabled?: boolean;
  refetchData: any;
  toggle: () => void;
  isOpen: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  actionButtonContainer: {
    marginTop: theme.spacing(2)
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  contentContainer: {
    margin: 0
  }
}));

export default function ModalCreateEditShopAdmin(props: IProps) {
  const classes = useStyles();
  const context = useContext(AppContext);
  const { t } = useTranslation();
  const { toast } = useToast();
  const client = useApolloClient();
  const {
    shopAdminId,
    shopId,
    disabled,
    refetchData,
    toggle,
    isOpen
  } = props;

  const {
    value, error, disable,
    setDisable, setValue,
    validate, checkApolloError, resetValue
  } = useForm({
    shop_admin_role_title: {
      value: ""
    },
    is_shop_owner_role: {
      value: ""
    },
    selectedShopAdminRole: {
      value: ""
    },
    user: {
      value: null
    },
    username: {
      value: "",
      emptyMessage: t("please enter username and select user"),
      validationField: "user_id"
    },
    shop_admin_role_id: {
      value: "",
      emptyMessage: t("please select shop admin role")
    }
  });

  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(true);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState<boolean>(false);

  const [loadUser, { data }] = useUserLazyQuery<IUserFragmentModalCreateEditShopAdmin>(userFragments.ModalCreateEditShopAdmin);

  let suggestionUsers: IUserFragmentModalCreateEditShopAdmin[] = [];

  if (data) {
    suggestionUsers = data.user.items;
  }

  const [
    createShopAdminMutation,
    { loading: isCreatingShopAdminMutation }
  ] = useCreateShopAdminMutation<IShopAdminFragmentModalCreateEditShopAdmin>(shopAdminFragments.ModalCreateEditShopAdmin, {
    onCompleted: () => {
      toast.default(
        t("{{title}} successfully created", {
          title: value.username
        })
      );
      handleOkCloseDialog();
      refetchData();
    },
    onError: async (error) => {
      await checkApolloError(error);
    }
  });

  const [
    editShopAdminMutation,
    { loading: isEditingShopAdminMutation }
  ] = useEditShopAdminMutation<IShopAdminFragmentModalCreateEditShopAdmin>(shopAdminFragments.ModalCreateEditShopAdmin, {
    onCompleted: () => {
      toast.default(
        t("{{title}} successfully updated", {
          title: value.username
        })
      );
      handleOkCloseDialog();
    },
    onError: async (error) => {
      await checkApolloError(error);
    }
  });

  useEffect(() => {
    resetStateData();
    getShopAdmin();
  }, [shopAdminId, shopId]);

  async function getShopAdmin() {
    if (shopAdminId && shopId) {
      setIsDataLoaded(false);
      let { data } = await client.query<{ shopAdmin: WithPagination<IShopAdminFragmentModalCreateEditShopAdmin> },
        ShopAdminVars>({
        query: shopAdminQuery(shopAdminFragments.ModalCreateEditShopAdmin),
        variables: {
          id: shopAdminId
        }
      });

      let shopAdminData = data.shopAdmin.items[0];
      setValue("shop_admin_role_title", shopAdminData.shop_admin_role.title);
      setValue("is_shop_owner_role", shopAdminData.shop_admin_role.is_shop_owner_role);
      setValue("username", shopAdminData.user.username);
      setValue("user", shopAdminData.user);
      setValue("shop_admin_role_id", shopAdminData.shop_admin_role_id);
      setDisable("", disabled);
      setIsDataLoaded(true);
    }
  }

  function resetStateData() {
    setIsDataLoaded(true);
    resetValue();
  }

  function handleCancelCloseDialog() {
    setIsCloseDialogOpen(false);
  }

  async function handleOkCloseDialog() {
    await resetStateData();
    setIsCloseDialogOpen(false);
    await toggle();
  }

  function toggleCloseDialog() {
    setIsCloseDialogOpen(true);
  }

  async function createShopAdmin() {
    if (await validate()) {
      createShopAdminMutation({
        variables: {
          shop_id: shopId,
          user_id: value.user.id,
          shop_admin_role_id: value.shop_admin_role_id
        }
      });
    }
  }

  async function editShopAdmin() {
    if (shopAdminId && await validate()) {
      editShopAdminMutation({
        variables: {
          shop_admin_id: shopAdminId,
          shop_id: shopId,
          user_id: value.user.id,
          shop_admin_role_id: value.shop_admin_role_id
        }
      });
    }
  }

  return <>
    <DialogConfirm open={isCloseDialogOpen}
                   onClose={handleCancelCloseDialog}
                   title={shopAdminId
                     ? t("cancel edit admin")
                     : t("cancel add admin")}
                   content={shopAdminId
                     ? t("are you sure cancel edit admin?")
                     : t("are you sure cancel add admin?")}
                   onConfirm={handleOkCloseDialog}/>
    <Modal
      disableAutoFocus
      open={isOpen}
      onClose={toggleCloseDialog}
      maxWidth={"md"}
      fullWidth
    >
      <Grid
        container
        direction="row"
        item
        xs={12}
        spacing={1}
        className={classes.contentContainer}
      >
        {isDataLoaded ? (
          <>
            <Grid item xs={12}>
              <Autosuggest
                theme={{
                  suggestionsList: classes.suggestionsList,
                  suggestion: classes.suggestion
                }}
                suggestions={suggestionUsers}
                renderInputComponent={(inputProps: any) => {
                  const {
                    classes,
                    inputRef = () => {
                    },
                    ref,
                    ...other
                  } = inputProps;

                  return (
                    <>
                      <TextField
                        fullWidth
                        InputProps={{
                          inputRef: (node: any) => {
                            ref(node);
                            inputRef(node);
                          },
                          classes: {
                            input: classes.input
                          }
                        }}
                        {...other}
                      />
                      <FormHelperText>
                        {t("username of user")}
                      </FormHelperText>
                    </>
                  );
                }}
                onSuggestionsFetchRequested={({ value }: any) => {
                  loadUser({
                    variables: {
                      limit: 10,
                      where_like_username: value
                    }
                  });
                }}
                inputProps={{
                  disabled: Boolean(value.is_shop_owner_role) || disable.username,
                  error: Boolean(error.username),
                  helperText: error.username,
                  classes,
                  placeholder: t("please enter username and select user"),
                  label: t("username"),
                  value: value.username,
                  onChange: (e: any) => {
                    setValue("username", e.target.value);
                    setValue("user", null);
                  },
                  onBlur: () => {
                    if (!value.user) {
                      setValue("username", "");
                    }
                  },
                  InputLabelProps: {
                    shrink: true
                  }
                }}
                getSuggestionValue={suggestion => suggestion.username}
                renderSuggestion={(
                  suggestion,
                  { query, isHighlighted }
                ) => {
                  const matches = match(suggestion.username, query);
                  const parts = parse(suggestion.username, matches);

                  return (
                    <MenuItem
                      selected={isHighlighted}
                      component="div"
                    >
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <UserAvatar user={suggestion}/>
                        </ListItemAvatar>
                        <ListItemText
                          primary={suggestion.name}
                          secondary={
                            <>
                              {parts.map(
                                (part: any, index: number) =>
                                  part.highlight ? (
                                    <span
                                      key={String(index)}
                                      style={{ fontWeight: 500 }}
                                    >
                                                  {part.text}
                                                </span>
                                  ) : (
                                    <strong
                                      key={String(index)}
                                      style={{ fontWeight: 300 }}
                                    >
                                      {part.text}
                                    </strong>
                                  )
                              )}
                            </>
                          }
                        />
                      </ListItem>
                    </MenuItem>
                  );
                }}
                renderSuggestionsContainer={options => (
                  <Paper {...options.containerProps} square>
                    {options.children}
                  </Paper>
                )}
                onSuggestionSelected={(
                  event,
                  {
                    suggestion
                    // suggestionValue,
                    // suggestionIndex,
                    // sectionIndex,
                    // method
                  }
                ) => {
                  setValue("username", suggestion.username);
                  setValue("user", suggestion);
                }}
              />
              {Boolean(value.is_shop_owner_role) && (
                <Typography variant="overline" color={"primary"}>
                  {t(
                    "this is shop owner admin, you can not modify this shop admin"
                  )}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              {Boolean(value.is_shop_owner_role) ? (
                <>
                  <TextField
                    required
                    disabled
                    label={t("shop admin role")}
                    value={value.shop_admin_role_title}
                    fullWidth
                  />
                  <Typography variant="overline" color={"primary"}>
                    {t(
                      "this is shop owner admin, you can not modify this shop admin"
                    )}
                  </Typography>
                </>
              ) : (
                <ShopAdminRoleSelect
                  fullWidth
                  margin="normal"
                  label={t("shop admin role")}
                  error={Boolean(error.shop_admin_role_id)}
                  helperText={error.shop_admin_role_id}
                  disabled={Boolean(value.is_shop_owner_role) || disable.shop_admin_role_id}
                  required
                  value={value.shop_admin_role_id}
                  onChange={(
                    value: unknown,
                    selectedShopAdminRole
                  ) => {
                    setValue("shop_admin_role_id", value);
                    setValue("selectedShopAdminRole", selectedShopAdminRole);
                  }}
                  variables={{
                    shop_id: context.shop.id,
                    is_shop_owner_role: 0
                  }}
                />
              )}
            </Grid>
            <Grid container item xs={12}>
              {value.selectedShopAdminRole && value.selectedShopAdminRole.permission && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      {t("permission")}
                    </Typography>
                  </Grid>
                  {value.selectedShopAdminRole.permission.map(
                    (permission: string) => (
                      <Grid
                        item
                        xs={6}
                        sm={4}
                        md={3}
                        key={permission}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              disabled={true}
                              checked={true}
                              value={permission}
                              color="primary"
                            />
                          }
                          label={t("permission$$" + permission)}
                        />
                      </Grid>
                    )
                  )}
                </>
              )}
            </Grid>
            <Grid
              container
              item
              justify="flex-end"
              xs={12}
              spacing={1}
              className={classes.actionButtonContainer}
            >
              <Grid item>
                <Button
                  onClick={toggleCloseDialog}
                  color="primary"
                >
                  {t("cancel")}
                </Button>
              </Grid>
              <Grid item>
                {!value.is_shop_owner_role && (
                  <>
                    {context.permission.includes(
                      "CREATE_SHOP_ADMIN"
                    ) && !shopAdminId && (
                      <ButtonSubmit onClick={createShopAdmin}
                                    variant="contained"
                                    color="primary"
                                    loading={isCreatingShopAdminMutation}
                                    loadingLabel={t("creating...")}
                                    label={t("create shop admin")}/>
                    )}
                    {context.permission.includes(
                      "UPDATE_SHOP_ADMIN"
                    ) && shopAdminId && (
                      <ButtonSubmit onClick={editShopAdmin}
                                    variant="contained"
                                    color="primary"
                                    loading={isEditingShopAdminMutation}
                                    loadingLabel={t("editing...")}
                                    label={t("edit shop admin")}/>
                    )}
                  </>
                )}
              </Grid>
            </Grid>
          </>
        ) : (
          <LoadingSkeleton/>
        )}
      </Grid>
    </Modal>
  </>;
}