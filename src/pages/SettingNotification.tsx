import { makeStyles, Theme } from "@material-ui/core/styles/index";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Helmet from "../components/seller/Helmet";
import { AppContext } from "../contexts/Context";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import useToast from "../components/_hook/useToast";
import { useShopNotificationSettingTypeQuery } from "../graphql/query/customQuery/ShopNotificationSettingTypeQuery";
import SHOP_NOTIFICATION_SETTING from "../constant/SHOP_NOTIFICATION_SETTING";
import { shopNotificationSettingTypeFragments } from "../graphql/fragment/query/customQuery/ShopNotificationSettingTypeFragment";
import { IShopNotificationSettingTypeFragmentDefaultFragment } from "../graphql/fragmentType/query/customQuery/ShopNotificationSettingTypeFragmentInterface";
import Skeleton from "@material-ui/lab/Skeleton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { IShopNotificationSettingFragmentSettingNotification } from "../graphql/fragmentType/query/ShopNotificationSettingFragmentInterface";
import { shopNotificationSettingFragments } from "../graphql/fragment/query/ShopNotificationSettingFragment";
import { useShopNotificationSettingQuery } from "../graphql/query/ShopNotificationSettingQuery";
import { useUpdateShopNotificationSettingMutation } from "../graphql/mutation/shopNotificationSettingMutation/UpdateShopNotificationSettingMutation";
import Paper from "@material-ui/core/Paper";
import EmailIcon from "@material-ui/icons/Email";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Switch from "@material-ui/core/Switch";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    padding: theme.spacing(3),
    overflow: "auto"
  },
  tabPaper: {
    flexGrow: 1,
    width: "100%",
  },
  tabContent: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  }
}));

export default function Setting() {
  const classes = useStyles();
  const { t } = useTranslation();
  const context = useContext(AppContext);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [enabledNotification, setEnabledNotification] = useState<Set<string>>(new Set());

  const [
    updateShopNotificationSettingMutation,
    { loading: isUpdatingShopNotificationSettingMutation }
  ] = useUpdateShopNotificationSettingMutation<IShopNotificationSettingFragmentSettingNotification>(shopNotificationSettingFragments.SettingNotification, {
    onCompleted: (data) => {
      toast.default(
        t("{{title}} successfully updated", {
          title: t("notificationSetting$$" + data.updateShopNotificationSettingMutation.title)
        })
      );
    }
  });

  const {
    data: shopNotificationSettingData,
    loading: isLoadingShopNotificationSetting
  } = useShopNotificationSettingQuery<IShopNotificationSettingFragmentSettingNotification>(shopNotificationSettingFragments.SettingNotification, {
    variables: {
      type: SHOP_NOTIFICATION_SETTING.NOTIFICATION_TYPE.EMAIL
    }
  });

  const {
    data: shopNotificationSettingTypeData,
    loading: isLoadingShopNotificationSettingType
  } = useShopNotificationSettingTypeQuery<IShopNotificationSettingTypeFragmentDefaultFragment>(shopNotificationSettingTypeFragments.DefaultFragment, {
    variables: {
      type: SHOP_NOTIFICATION_SETTING.NOTIFICATION_TYPE.EMAIL
    }
  });

  let shopNotificationSettings: IShopNotificationSettingFragmentSettingNotification[] = [];

  if (shopNotificationSettingData) {
    shopNotificationSettings = shopNotificationSettingData.shopNotificationSetting;
  }

  let shopNotificationSettingTypes: IShopNotificationSettingTypeFragmentDefaultFragment[] = [];

  if (shopNotificationSettingTypeData) {
    shopNotificationSettingTypes = shopNotificationSettingTypeData.shopNotificationSettingType;
  }

  useEffect(() => {
    let newEnabledNotification = shopNotificationSettings
      .filter(setting => setting.is_enable)
      .map(setting => setting.title);

    let allNotification = shopNotificationSettingTypes
      .map(shopNotificationSettingType =>
        shopNotificationSettingType.notification).flat();

    newEnabledNotification = [
      ...newEnabledNotification,
      ...allNotification.filter(
        notification => !shopNotificationSettings.find(setting => setting.title === notification)
      )];
    setEnabledNotification(new Set(newEnabledNotification));
  },[isLoadingShopNotificationSettingType, isLoadingShopNotificationSetting]);

  if (isLoadingShopNotificationSetting || isLoadingShopNotificationSettingType) {
    return <>
      {new Array(4).fill(6).map((ele, index) => {
        return (
          <Grid key={index} item xs={12}>
            <Skeleton variant={"rect"} height={50}/>
          </Grid>
        );
      })}
    </>;
  }

  let disabled = !context.permission.includes("UPDATE_SHOP_NOTIFICATION_SETTING");

  return <>
    <Helmet
      title={t("notification setting")}
      description={""}
      keywords={t("notification setting")}
      ogImage="/images/favicon-228.png"
    />
    <Paper elevation={1}>
      <Grid container item xs={12} className={classes.root}>
        <Typography variant="h6">
          {t("notification setting")}
        </Typography>
      </Grid>
      <Paper square className={classes.tabPaper} elevation={1}>
        <Tabs
          value={activeTab}
          onChange={(event: React.ChangeEvent<{}>, newValue: number) => {
            setActiveTab(newValue);
          }}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<EmailIcon />} label={t('email')} />
        </Tabs>
      </Paper>
      <Grid container className={classes.tabContent}>
        <Grid container spacing={2}>
          <Grid item container justify={"center"} xs={12}>
            {activeTab === 0 && (
              <Grid container item spacing={1} xs={11}>
                {shopNotificationSettingTypes.map(shopNotificationSettingType => {
                  let section = shopNotificationSettingType.notificationSection;
                  let sectionNotifications = shopNotificationSettingType.notification;
                  return (
                    <React.Fragment key={section}>
                      <Grid item xs={12}>
                        <Typography
                          variant="subtitle1"
                          display="inline"
                        >
                          {t("notificationSetting$$" + section)}
                        </Typography>
                      </Grid>
                      {sectionNotifications.map(
                        (notification) => {
                          let isChecked = enabledNotification.has(notification);
                          return (
                            <Grid
                              item
                              xs={6}
                              sm={4}
                              md={3}
                              key={notification}
                            >
                              <FormControlLabel
                                control={
                                  <Switch
                                    disabled={disabled}
                                    checked={isChecked}
                                    onChange={() => {
                                      let newEnableNotification = new Set(Array.from(enabledNotification));
                                      if(isChecked) {
                                        newEnableNotification.delete(notification);
                                      } else {
                                        newEnableNotification.add(notification);
                                      }
                                      setEnabledNotification(newEnableNotification);

                                      updateShopNotificationSettingMutation({
                                        variables: {
                                          shop_id: context.shop.id,
                                          type: SHOP_NOTIFICATION_SETTING.NOTIFICATION_TYPE.EMAIL,
                                          title: notification,
                                          is_enable: !isChecked
                                        }
                                      });
                                    }}
                                    value={notification}
                                    color="primary"
                                  />
                                }
                                label={t("notificationSetting$$" + notification)}
                              />
                            </Grid>
                          );
                        }
                      )}
                    </React.Fragment>
                  );
                })}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  </>;
}