import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { StyledComponentProps } from '@material-ui/core/styles/withStyles';
import Carousel, { Modal, ModalGateway } from 'react-images';

interface IProps extends StyledComponentProps {
  classes: any;
  onClose: () => void;
  views: any[];
  isOpen: Boolean;
  currentIndex?: number;
}

class ImagesCarousel extends React.Component<IProps, Readonly<any>> {
  render() {
    let { onClose, views, isOpen, currentIndex } = this.props;

    return (
      <ModalGateway>
        {isOpen ? (
          <Modal
            styles={{
              blanket: (base: any) => ({ ...base, ...{ zIndex: 10000 } }),
              positioner: (base: any) => ({ ...base, ...{ zIndex: 10000 } })
            }}
            onClose={onClose}
          >
            <Carousel views={views} currentIndex={currentIndex} />
          </Modal>
        ) : null}
      </ModalGateway>
    );
  }
}

export default withStyles(theme => ({}))(ImagesCarousel);
