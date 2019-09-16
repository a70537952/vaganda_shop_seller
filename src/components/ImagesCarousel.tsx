import React from 'react';
import {StyledComponentProps} from '@material-ui/core/styles/withStyles';
import Carousel, {Modal, ModalGateway} from 'react-images';

interface IProps extends StyledComponentProps {
    onClose: () => void;
    views: any[];
    isOpen: Boolean;
    currentIndex?: number;
}

export default function ImagesCarousel(props: IProps) {
    const {
        onClose, views, isOpen, currentIndex
    } = props;

    return <ModalGateway>
        {isOpen ? (
            <Modal
                styles={{
                    blanket: (base: any) => ({...base, ...{zIndex: 10000}}),
                    positioner: (base: any) => ({...base, ...{zIndex: 10000}})
                }}
                onClose={onClose}
            >
                <Carousel views={views} currentIndex={currentIndex}/>
            </Modal>
        ) : null}
    </ModalGateway>;
}
