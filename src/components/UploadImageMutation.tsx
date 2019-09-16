import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

interface IProps {
  onCompleted: (data: any, props: IProps) => void;
  onError: (error: any, props: IProps) => void;
  uploadImage: (files: any, uploadImageMutation: any, props: IProps) => void;
  multiple?: boolean;
  id: string;
  className?: string;
  index?: number;
}

export default class UploadImageMutation extends React.Component<
  IProps,
  Readonly<{}>
> {
  render() {
    return (
      <Mutation
        mutation={gql`
          mutation UploadImageMutation($images: [Upload]!) {
            uploadImageMutation(images: $images) {
              id
              path
              image_small
              image_medium
              image_large
            }
          }
        `}
        onCompleted={data => {
          this.props.onCompleted(data, this.props);
        }}
        onError={error => {
          this.props.onError(error, this.props);
        }}
      >
        {(uploadImageMutation, { data, loading, error }) => {
          return (
            <input
              multiple={this.props.multiple}
              onChange={e => {
                let files = e.target.files;
                this.props.uploadImage(files, uploadImageMutation, this.props);
                e.target.value = '';
              }}
              id={this.props.id}
              accept="image/*"
              type="file"
              className={this.props.className}
            />
          );
        }}
      </Mutation>
    );
  }
}
