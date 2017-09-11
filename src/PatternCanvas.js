import React, { Component } from 'react';
import sample from './assets/sample.png';
import { ChromePicker } from 'react-color';
import './patternCanvas.css';

class PatternCanvas extends Component {

  state = {
    width: 300,
    height: 500,
    spacing: 100,
    sizing: 100,
    rotation: 0,
    background: '#fff8d3',
    readyToDraw: false,
    showColorPicker: false,
  };

  componentDidMount() {
    window.onresize = this.resize;
    this.resize();

    this.canvasAssets = [];
    const pattern = [sample];
    this.preloadImages(pattern, this.canvasAssets, this.drawCanvas);
  }

  componentDidUpdate() {
    if (this.state.readyToDraw)
      this.drawCanvas();
  }

  // update canvas sizing based on window/container sizing
  resize = () => {
    this.patternCanvas.width = this.canvasContainer.clientWidth;
    this.patternCanvas.height = this.canvasContainer.clientHeight;
    this.setState({
      width: this.canvasContainer.clientWidth,
      height: this.canvasContainer.clientHeight,
    });
    if (this.state.readyToDraw)
      this.drawCanvas();
  }

  // preload images so it can be used synchronously on canvas
  preloadImages = (srcs, imgs, draw) => {
    let img;
    let remaining = srcs.length;
    const removeFinished = () => {
      remaining--;
      if (remaining <= 0) {
        this.setState({ readyToDraw: true });
        draw();
      }
    }

    for (let i = 0; i < srcs.length; i++) {
      img = new Image();
      img.onload = removeFinished;
      img.src = srcs[i];
      imgs.push(img);
    }
  }

  // draw canvas content
  // call this function again to refresh/re-render
  // make sure image assets are ready
  drawCanvas = () => {
    const {
      width,
      height,
      background,
    } = this.state;

    const ctx = this.patternCanvas.getContext('2d');

    if (ctx) {

      // base background color
      ctx.beginPath();
      ctx.rect(0, 0, width, height);
      ctx.fillStyle = background;
      ctx.fill();

      // pattern
      this.patternize(ctx);
    }
  }

  // generate image pattern on canvas
  patternize = ctx => {
    const {
      width,
      height,
      spacing,
      sizing,
      rotation,
    } = this.state;
    const TO_RADIANS = Math.PI / 180;

    let currentX = 0 - spacing;
    let currentY = 0 - spacing;

    while(currentY <= height + spacing) {
      let i = 0;
      currentX = 0 - spacing;
      let angle = (rotation % 360) * TO_RADIANS;

      while(currentX <= width + spacing) {
        let offsetX = (spacing - sizing) / 2;
        let offsetY = ((spacing - sizing) / 2) + ((i % 2) * (spacing / 2));
        let posX = currentX + offsetX;
        let posY = currentY + offsetY;

        ctx.translate(posX, posY);
        ctx.rotate(angle);
        ctx.drawImage(this.canvasAssets[0], -(sizing / 2), -(sizing / 2), sizing, sizing);
        ctx.rotate(-angle);
        ctx.translate(-posX, -posY);

        currentX += spacing;
        i++;
      }
      currentY += spacing;
    }
  }

  changeSpacing = () => {
    this.setState({ spacing: parseInt(this.inputSpacing.value, 10) });
  }

  changeSizing = () => {
    this.setState({ sizing: parseInt(this.inputSizing.value, 10) });
  }

  changeRotation = () => {
    this.setState({ rotation: parseInt(this.inputRotation.value, 10) });
  }

  changeBackground = color => {
    this.setState({ background: color.hex });
  }

  toggleColorPicker = () => {
    this.setState(prevState => ({ showColorPicker: !prevState.showColorPicker }));
  }
  
  render() {
    const {
      width,
      height,
      spacing,
      sizing,
      rotation,
      background,
      showColorPicker,
    } = this.state;

    const spacingRange = {
      min: 10,
      max: 200,
    };
    const sizingRange = {
      min: 10,
      max: 200,
    };
    const rotationRange = {
      min: -180,
      max: 180
    };

    return (
      <div className='pattern-creator'>
        <main>
          <section>
            <label>
              Spacing : {spacing}
              <div className='input-container'>
                <span>{spacingRange.min}</span>
                <input
                  type="range"
                  min={spacingRange.min}
                  max={spacingRange.max}
                  defaultValue={spacing}
                  ref={el => this.inputSpacing = el}
                  onChange={this.changeSpacing}
                />
                <span>{spacingRange.max}</span>
              </div>
            </label>
          </section>
          <section>
            <label>
              Pattern Size: {sizing}
              <div className='input-container'>
                <span>{sizingRange.min}</span>
                <input
                  type="range"
                  min={sizingRange.min}
                  max={sizingRange.max}
                  defaultValue={sizing}
                  ref={el => this.inputSizing = el}
                  onChange={this.changeSizing}
                />
                <span>{sizingRange.max}</span>
              </div>
            </label>
          </section>
          <section>
            <label>
              Pattern Rotation : {rotation}
              <div className='input-container'>
                <span>{rotationRange.min}</span>
                <input
                  type="range"
                  min={rotationRange.min}
                  max={rotationRange.max}
                  defaultValue={rotation}
                  ref={el => this.inputRotation = el}
                  onChange={this.changeRotation}
                />
                <span>{rotationRange.max}</span>
              </div>
            </label>
          </section>
          <section>
            <label>
              Background Color:
              <div className='picker-container'>
                <span
                  className='background-color'
                  style={{
                    backgroundColor: background
                  }}
                  onClick={this.toggleColorPicker}
                />
              </div>
              {
                showColorPicker &&
                 <div>
                  <div
                    className='picker-overlay'
                    onClick={this.toggleColorPicker}
                  />
                  <ChromePicker
                    color={background}
                    onChange={this.changeBackground}
                  />
                </div>
              }
            </label>
          </section>
        </main>
        <sidebar
          ref={el => {this.canvasContainer = el}}
        >
          <canvas
            ref={el => {this.patternCanvas = el}}
            height={height + 'px'}
            width={width + 'px'}
          />
        </sidebar>
      </div>
    );
  }
}

export default PatternCanvas;