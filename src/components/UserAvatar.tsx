import Avatar from '@material-ui/core/Avatar';
import {makeStyles, Theme} from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import classnames from 'classnames';
import React from 'react';
import {StyledComponentProps} from '@material-ui/core/styles/withStyles';

interface IProps extends StyledComponentProps {
    className?: string;
    user?: any;
}

const useStyles = makeStyles((theme: Theme) => ({
    avatar: {
        width: 30,
        height: 30
    }
}));

export default function UserAvatar(props: IProps) {
    const classes = useStyles();
    const {
        className, user
    } = props;
    let avatarClass = classnames(classes.avatar, className);

    return <React.Fragment>
        {user ? (
            <React.Fragment>
                {user.user_info && user.user_info.avatar ? (
                    <Avatar
                        alt={'avatar'}
                        src={user.user_info.avatar_small}
                        className={avatarClass}
                    />
                ) : (
                    <Avatar alt={'avatar'} className={avatarClass}>
                        {user.name[0].toUpperCase()}
                    </Avatar>
                )}
            </React.Fragment>
        ) : (
            <React.Fragment>
                <AccountCircle className={className}/>
            </React.Fragment>
        )}
    </React.Fragment>;
}
