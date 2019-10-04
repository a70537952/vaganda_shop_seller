import gql from "graphql-tag";

export let shopNotificationSettingTypeFragments: any = {
  DefaultFragment: gql`
    fragment fragment on ShopNotificationSettingType {
      notificationSection
      notification
    }
  `
};
