import React, { Component } from 'react';
import styled from '@emotion/styled';
import Slide from './Slide';
import PropTypes from 'prop-types';
import { config } from 'react-spring';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const NavigationButtons = styled.div`
  position: relative;
  display: flex;
  height: 60px;
  margin: 0 auto;
  width: 20%;
  margin-top: 1rem;
  justify-content: space-between;
  z-index: 1000;
`;

const NavBtn = styled.div`
  background: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 3px;
`;

function mod(a, b) {
  // to support negative number, using +b
  return ((a % b) + b) % b;
}

class VerticalCarousel extends React.Component {
  static propTypes = {
    slides: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.any,
        content: PropTypes.object
      })
    ).isRequired,
    autoPlay: PropTypes.number,
    autoPlayEventLisner: PropTypes.func,
    allowKeyOperation: PropTypes.bool,
    showNavigation: PropTypes.bool,
    offsetRadius: PropTypes.number,
    animationConfig: PropTypes.object
  };

  static defaultProps = {
    autoPlay: 0,
    allowKeyOperation: false,
    showNavigation: false,
    offsetRadius: 3,
    animationConfig: config.gentle,
  };

  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      _interval: null,
    };
  }

  _handleKeyDown(e) {
    if (e.isComposing || e.keyCode === 229) {
      return;
    } else if (e.keyCode === 38) {
      this.moveSlide(1);
    } else if (e.keyCode === 40) {
      this.moveSlide(-1);
    }
  } 

  componentDidMount = () => {
    if (this.props.allowKeyOperation) {
      document.addEventListener('keydown', this._handleKeyDown.bind(this));
    }
    if (this.props.autoPlay) {
      // workaround to solve the issue that the leaflet on the same pace doesn't adjust its map coordinate.
      setTimeout((that) => {
        that.moveSlide(1);
        if (that.props.autoPlayEventLisner) {
          that.props.autoPlayEventLisner();
        }
      }, 5, this);

      setInterval((that) => {
        that.moveSlide(1);
        if (that.props.autoPlayEventLisner) {
          that.props.autoPlayEventLisner();
        }
      }, this.props.autoPlay, this);
    }
  };

  componentWillUnmount = () => {
    if (this.props.allowKeyOperation) {
      document.removeEventListener('keydown', this._handleKeyDown.bind(this));
    }
    if (this.props.autoPlay) {
      clearInterval(this.state._interval);
    }
  };

  modBySlidesLength = index => {
    return mod(index, this.props.slides.length);
  };

  moveSlide = direction => {
    this.setState({
      index: this.modBySlidesLength(this.state.index + direction),
    });
  };

  clampOffsetRadius(offsetRadius) {
    const { slides } = this.props;
    const upperBound = Math.floor((slides.length - 1) / 2);

    if (offsetRadius < 0) {
      return 0;
    }
    if (offsetRadius > upperBound) {
      return upperBound;
    }

    return offsetRadius;
  }

  getPresentableSlides() {
    const { slides } = this.props;
    const { index } = this.state;
    let { offsetRadius } = this.props;

    offsetRadius = this.clampOffsetRadius(offsetRadius);
    const presentableSlides = new Array();

    for (let i = -offsetRadius; i < 1 + offsetRadius; i++) {
      presentableSlides.push(slides[this.modBySlidesLength(index + i)]);
    }

    return presentableSlides;
  }

  render() {
    const { animationConfig, offsetRadius, showNavigation } = this.props;

    let navigationButtons = showNavigation ? (
      <NavigationButtons>
        <NavBtn onClick={() => this.moveSlide(1)}>&#8593;</NavBtn>
        <NavBtn onClick={() => this.moveSlide(-1)}>&#8595;</NavBtn>
      </NavigationButtons>
    ) : null;

    return (
      <React.Fragment>
        <Wrapper>
          {this.getPresentableSlides().map((slide, presentableIndex) => (
            <Slide
              key={slide.key}
              content={slide.content}
              moveSlide={this.moveSlide}
              offsetRadius={this.clampOffsetRadius(offsetRadius)}
              index={presentableIndex}
              animationConfig={animationConfig}
            />
          ))}
        </Wrapper>
        {navigationButtons}
      </React.Fragment>
    );
  }
}

export default VerticalCarousel;
