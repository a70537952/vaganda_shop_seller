import React from 'react';
import {useUploadImageMutation} from "../graphql/mutation/UploadImageMutation";
import {uploadImageMutationMutationFragments} from "../graphql/fragment/mutation/UploadImageMutationFragment";

interface IProps {
    onCompleted: (data: any, props: IProps) => void;
    onError: (error: any, props: IProps) => void;
    uploadImage: (files: any, uploadImageMutation: any, props: IProps) => void;
    multiple?: boolean;
    id: string;
    className?: string;
    index?: number;
}

export default function UploadImageMutation(props: IProps) {
    const [
        uploadImageMutation,
        {loading: isUploadingImageMutation}
    ] = useUploadImageMutation(uploadImageMutationMutationFragments.UploadImageMutation, {
        onCompleted: (data) => {
            onCompleted(data, props);
        },
        onError: (error) => {
            onError(error, props);
        }
    });

    const {
        onCompleted,
        onError,
        uploadImage,
        multiple,
        id,
        className,
    } = props;

    return <input
        multiple={multiple}
        onChange={e => {
            let files = e.target.files;
            uploadImage(files, uploadImageMutation, props);
            e.target.value = '';
        }}
        id={id}
        accept="image/*"
        type="file"
        className={className}
    />

}