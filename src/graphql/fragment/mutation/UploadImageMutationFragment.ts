import gql from 'graphql-tag';

export let uploadImageMutationMutationFragments: any = {
  UploadImageMutation: gql`
    fragment fragment on TempImage {
           id
              path
              image_small
              image_medium
              image_large
    }
  `
};
