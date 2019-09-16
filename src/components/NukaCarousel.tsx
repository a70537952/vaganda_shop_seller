import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { StyledComponentProps } from '@material-ui/core/styles/withStyles';
import Carousel from 'nuka-carousel';

interface IProps extends StyledComponentProps {
  classes: any;
  slidesToShow?: number;
  heightMode: 'first' | 'current' | 'max';
}

class NukaCarousel extends React.Component<IProps, Readonly<any>> {
  render() {
    let { classes, slidesToShow, children, heightMode } = this.props;

    return (
      <Carousel
        renderBottomCenterControls={() => null}
        slidesToShow={slidesToShow}
        heightMode={heightMode}
        initialSlideHeight={110}
        renderCenterLeftControls={({
          previousSlide,
          currentSlide,
          wrapAround,
          slideCount
        }) => {
          let disabled =
            (currentSlide === 0 && !wrapAround) || slideCount === 0;

          if (disabled) return null;

          return (
            <button
              style={{
                border: 0,
                background: 'rgba(0,0,0,0.4)',
                color: 'white',
                padding: 10,
                opacity: disabled ? 0.3 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer'
              }}
              onClick={previousSlide}
            >
              {'<'}
            </button>
          );
        }}
        renderCenterRightControls={({
          nextSlide,
          currentSlide,
          slidesToShow,
          slideCount,
          cellAlign
        }) => {
          const lastSlideIndex = slideCount - 1;
          let slidesShowing = slidesToShow;
          let lastSlideOffset = 0;

          switch (cellAlign) {
            case 'center':
              slidesShowing = (slidesToShow - 1) * 0.5;
              lastSlideOffset = Math.floor(slidesToShow * 0.5) - 1;
              break;
            case 'right':
              slidesShowing = 1;
              break;
          }
          let disabled;

          if (slidesToShow > 1) {
            disabled =
              currentSlide + slidesShowing > lastSlideIndex + lastSlideOffset;
          } else {
            disabled = currentSlide + 1 > lastSlideIndex;
          }

          if (disabled) return null;

          return (
            <button
              style={{
                border: 0,
                background: 'rgba(0,0,0,0.4)',
                color: 'white',
                padding: 10,
                opacity: disabled ? 0.3 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer'
              }}
              onClick={nextSlide}
            >
              {'>'}
            </button>
          );
        }}
      >
        {children}
      </Carousel>
    );
  }
}

export default withStyles(theme => ({}))(NukaCarousel);
