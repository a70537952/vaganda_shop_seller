import Avatar from '@material-ui/core/Avatar';
import {makeStyles, Theme} from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import classnames from 'classnames';
import React from 'react';
import {StyledComponentProps} from '@material-ui/core/styles/withStyles';

interface IProps extends StyledComponentProps {
    className?: string;
    user?: {
        id: string
        user_info: {
            avatar: string;
            avatar_small: string;
        }
        [key: string] : any
    };
    size?: number;
}


export default function UserAvatar(props: IProps) {
    const {
        className, user, size
    } = props;
    let avatarSize = size || 30;
    let style = {
        width: avatarSize,
        height: avatarSize
    };

    if(!user) {
        return <AccountCircle className={className} style={style}/>;
    }

    return user.user_info && user.user_info.avatar ? (
            <Avatar
                alt={'avatar'}
                src={user.user_info.avatar_small}
                className={className}
                style={style}
            />
        ) : (
            <Avatar alt={'avatar'} className={className} style={style}>
                {user.name[0].toUpperCase()}
            </Avatar>
        );
}
