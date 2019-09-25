import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from '@material-ui/core/styles/index';
import ClearIcon from '@material-ui/icons/Clear';
import classnames from 'classnames';
import React from 'react';
import Image from './Image';

interface IProps {
    src: string;
    title?: string;
    titlePosition?: 'top' | 'bottom';
    remove?: () => void;
    disabled?: boolean;
    className?: string;
}


const useStyles = makeStyles({
    img: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    titleBar: {
        background:
            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
    },
    icon: {
        color: 'white'
    }
});

export default function RemovableImage(props: IProps) {
    const classes = useStyles();
    const {
        src,
        title,
        titlePosition,
        remove,
        disabled,
        className
    } = props;

    return <GridListTile
        className={classnames(className)}
        component={'span'}
    >
        <Image
            src={src}
            title={title}
            className={classes.img}
        />
        {!disabled && (
            <GridListTileBar
                title={title}
                titlePosition={titlePosition || 'top'}
                actionIcon={
                    <IconButton className={classes.icon} onClick={remove}>
                        <ClearIcon/>
                    </IconButton>
                }
                actionPosition="right"
                className={classes.titleBar}
            />
        )}
    </GridListTile>;
}