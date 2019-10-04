import gql from "graphql-tag";

export let shopNotificationSettingFragments: any = {
  SettingNotification: gql`
    fragment fragment on ShopNotificationSetting {
      id
      shop_id
      type
      title
      is_enable
    }
  `
};
