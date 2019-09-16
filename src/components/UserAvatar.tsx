import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import classnames from 'classnames';
import React from 'react';
import { StyledComponentProps } from '@material-ui/core/styles/withStyles';

interface IProps extends StyledComponentProps {
  className?: string;
  user?: any;
}

class UserAvatar extends React.Component<IProps, Readonly<any>> {
  render() {
    let { classes, className, user } = this.props;
    classes = classes || {};

    let avatarClass = classnames(classes.avatar, className);
    return (
      <React.Fragment>
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
            <AccountCircle className={className} />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default withStyles(theme => ({
  avatar: {
    width: 30,
    height: 30
  }
}))(UserAvatar);
