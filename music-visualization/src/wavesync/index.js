import Visualizer from './visualizer'
import { interpolateBasis, interpolateRgbBasis } from 'd3-interpolate'
import { scaleLinear } from 'd3-scale'
import { color } from 'd3-color'

const TWO_PI = Math.PI * 2
const PI_OVER_180 = Math.PI / 180

export default class WaveSync extends Visualizer {

  constructor ({ fixed = false } = {}) {
    super({
      volumeSmoothing: 75,
      hidpi: false
    }, fixed)

    this.theme = [
      color('#FFE66D'), // yellow
      color('#4ECDC4'), // turqoise
      color('#FF6B6B'), // red,
      color('#292F36'),  // black
      color('#001124'), // darker black
    ]

    this.overlayColors = [
      color('#4281A4'), 
      color('#48A9A6'), 
      color('#E4DFDA'), 
      color('#D4B483'),
      color('#C1666B'),
      color('#D4B483'), 
      color('#E4DFDA'),
      color('#48A9A6'),
      color('#4281A4')
    ].map(({ r, g, b }) => `rgba(${r}, ${g}, ${b}, 1)`)

    this.setGradients()
    this.setCtxParams()
    this.setScales()
    this.watch()

    window.addEventListener('resize', () => {
      this.setGradients()
      this.setCtxParams()
    })

    this.sync.watch('trackFeatures', () => {
      this.sync.state.volumeSmoothing = this.smoothingScale(this.sync.state.trackFeatures.energy)
    })
  }

  setGradients () {
    const gradientRadius = (this.sketch.height > this.sketch.width)
      ? this.sketch.height / 2
      : this.sketch.width / 2

    const center = {
      x: this.sketch.width / 2,
      y: this.sketch.height / 2
    }

    this.gradient = this.sketch.ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, gradientRadius)
    this.gradient.addColorStop(0, this.theme[0])
    this.gradient.addColorStop(0.5, this.theme[1])
    this.gradient.addColorStop(1, this.theme[0])

    this.gradient2 = this.sketch.ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, gradientRadius / 3)
    this.gradient2.addColorStop(0, this.theme[0])
    this.gradient2.addColorStop(0.5, this.theme[1])
    this.gradient2.addColorStop(1, this.theme[0])

    this.gradient3 = this.sketch.ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, gradientRadius)
    this.gradient3.addColorStop(0, this.theme[4])
    this.gradient3.addColorStop(1, this.theme[3])
  }

  setCtxParams () {
    this.sketch.ctx.lineCap = 'round'
    this.sketch.ctx.lineJoin = 'round'
  }

  setScales () {
    this.rotationScale = scaleLinear()
      .domain([0, 1])
      .range([3000, 800])

    this.radiusScale = scaleLinear()
      .domain([0, .3, .6, 1])
      .range([.5, 1, 1.1, 1.2])

    this.smoothingScale = scaleLinear()
      .domain([0, 1])
      .range([100, 30])
  }

  createPath (ctx, { x, y }, iterations = 3) {
    ctx.beginPath()
    for (var i = 0; i < iterations * TWO_PI; i += PI_OVER_180) {
      const _x = x(i)
      const _y = y(i)
      if (i === 0) {
        ctx.moveTo(_x, _y)
      } else {
        ctx.lineTo(_x, _y)
      }
    }
  }

  render (ctx, boxes) {
      for (var idx in boxes) {
        var box = boxes[idx];
        ctx.beginPath();
        for (var i = 0; i < box.bound.length; i++) {
          var position = box.bound[i];
          if (i == 0) {
            ctx.moveTo(position.x, position.y);
          } else {
            ctx.lineTo(position.x, position.y );
          }
        }
      }
    }


  paintBackground ({ ctx, width, height }) {
    this.sketch.ctx.fillStyle = this.gradient3
    ctx.fillRect(0, 0, width, height)
  }

  paintOuterLines ({ ctx, width, height, now }) {
    const { progress } = this.sync.getInterval('tatum')
    const base = (width > height) ? width / 10 : height / 10
    const iAmp = interpolateBasis([this.sync.volume * -base, this.sync.volume * base, this.sync.volume * -base]) 
    const amp = iAmp(progress) * this.radiusScale(this.sync.state.trackFeatures.energy) / 2
    const radius = (width > height) ? this.sync.volume * height / 3 : this.sync.volume * width / 3
    const x = ANGLE => (radius + amp * Math.sin(7 * (ANGLE + now/this.rotationScale(this.sync.state.trackFeatures.energy)))) * Math.tan(ANGLE)  + width/2
    const y = ANGLE => (radius + amp * Math.sin(7 * (ANGLE + now/this.rotationScale(this.sync.state.trackFeatures.energy)/2))) * Math.cos(ANGLE) + height /2

    // const x = ANGLE => (radius + amp * Math.sin(7 * (ANGLE + now/this.rotationScale(this.sync.state.trackFeatures.energy)))) * Math.tan(ANGLE) + width/2
    // const y = ANGLE => (radius + amp * Math.sin(7 * (ANGLE + now/this.rotationScale(this.sync.state.trackFeatures.energy)/2))) * Math.cos(ANGLE) + height/2

    this.createPath(ctx, { x, y })
    
    ctx.lineWidth = (this.sync.volume * 5)
    ctx.strokeStyle = this.gradient
    ctx.stroke()
    // ctx.fillRect(0, (height/2) - (this.sync.volume * 20), width, this.sync.volume * 40)
  }

  paintInnerLines ({ ctx, width, height, now }) {
    const { progress } = this.sync.getInterval('beat')
    // const volume = Math.pow(this.sync.volume, 1)
    const volume = this.sync.volume
    const amp = interpolateBasis([volume * (height / 4), volume * (height / 4)])(progress)
    const radius = (width > height) ? volume * height / 3 : volume * width / 3
    const x = ANGLE => (radius + amp * Math.sin(2.019 * (ANGLE + now/this.rotationScale(this.sync.state.trackFeatures.energy) * 8))) * Math.cos(ANGLE) + width/2
    const y = ANGLE => (radius + amp * Math.sin(2.019 * (ANGLE + now/this.rotationScale(this.sync.state.trackFeatures.energy) * 4))) * Math.sin(ANGLE) + height/2
    // const x = ANGLE => (amp * Math.cos(4.05 * (ANGLE + now))) + width/2
    // const y = ANGLE => (amp * Math.sin(4.05 * (ANGLE + now))) + height/2

    this.createPath(ctx, { x, y }, 15)

    ctx.lineWidth = Math.min(volume, 1)
    ctx.strokeStyle = this.gradient2
    ctx.stroke()
  }

  paintCenter ({ ctx, width, height, now }) {
    const { progress } = this.sync.getInterval('tatum')
    const base = (width > height) ? width / 10 : height / 10
    const iAmp = interpolateBasis([this.sync.volume * -base, this.sync.volume * base, this.sync.volume * -base]) 
    const amp = iAmp(progress) * this.radiusScale(this.sync.state.trackFeatures.energy) 
    // const amp = interpolateBasis([this.sync.volume * (height / 4), this.sync.volume * (height / 4)])(progress)
    const radius = (width > height) ? this.sync.volume * height / 4 : this.sync.volume * width / 4
    const x = ANGLE => (radius + amp*.2* Math.sin(7.05 * (ANGLE + now/this.rotationScale(this.sync.state.trackFeatures.energy)*4))) * Math.cos(ANGLE) + width/2
    const y = ANGLE => (radius + amp*.2* Math.cos(7.05 * (ANGLE + now/this.rotationScale(this.sync.state.trackFeatures.energy)))) * Math.sin(ANGLE) + height/2
    // const iLineWidth = interpolateBasis([this.sync.volume * (width > height ? width : height) / 50, this.sync.volume , this.sync.volume  * (width > height ? width : height) / 50])

    this.createPath(ctx, { x, y }, 10)

    ctx.lineWidth = Math.min(this.sync.volume, 1)
    // ctx.lineWidth = iLineWidth(progress)
    ctx.strokeStyle = this.gradient
    ctx.stroke()
  }

  paintOverlay ({ ctx, width, height, now }) {
    if (!this.backgroundTick) {
      this.backgroundTick = now
    }
    const { progress } = this.sync.getInterval('section')
    const backgroundProgress = Math.min((now - this.backgroundTick) / 10000, 1)
    ctx.save()
    ctx.globalCompositeOperation = 'overlay'
    ctx.fillStyle = interpolateRgbBasis(this.overlayColors)(progress)
    // ctx.fillStyle = interpolateRgbBasis(this.overlayColors)(backgroundProgress)
    ctx.fillRect(0, 0, width, height)
    ctx.restore()

    if (backgroundProgress === 1) {
      this.backgroundTick = now
    }
  }

  // paintRectangles({ ctx, width, height}){

  //   // const { progress } = this.sync.getInterval('beat')
  //   // const base = (width > height) ? width / 10 : height / 10
  //   // const iAmp = interpolateBasis([this.sync.volume * -base, this.sync.volume * base, this.sync.volume * -base]) 
  //   // const amp = iAmp(progress) * this.sync.state.trackFeatures.energy

  //   const boxes = generateBoxes(70, 10, {x:0, y:0});

  //   function generateBoxes (row, col, position, size, space) {
  //     position = position != undefined ? position : {x: 0, y: 0};
  //     size = size != undefined ? size : 50;
  //     space = space != undefined ? space : 4;

  //     var boxes = [];
  //     var offset = size + space;
  //     var center = size*0.2;
  //     for (var r = 0; r < row; r++) {
  //       for (var c = 0; c < col; c++) {
  //         var centerX = position.x + offset * r + center;
  //         var centerY = position.y + offset * c + center;
  //         boxes.push({
  //           normal: {x:1, y:1},
  //           center: {x: centerX, y: centerY},
  //           bound: [
  //             {x: centerX - 2, y: centerY - 2},
  //             {x: centerX + 2, y: centerY - 2},
  //             {x: centerX + 2, y: centerY + 2},
  //             {x: centerX - 2, y: centerY + 2}]
  //         });
  //       }
  //     }
  //     return boxes;
  //   }

  //   this.render(ctx, boxes)

  //   ctx.strokeStyle = this.gradient
  //   ctx.stroke()
  //   // ctx.fillRect(0, (height/2) - (this.sync.volume * 20), width, this.sync.volume * 40)

  // }

  updateCanvas({ ctx, width, height, now}){
    
    if (!this.backgroundTick) {
      this.backgroundTick = now
    }
    // const { progress } = this.sync.getInterval('beat')
    // const volume = this.sync.volume
    // const rad = interpolateBasis([volume * (height / 4), volume * (height / 4)])(progress)
    // const rad = (width > height) ? volume * height / 3 : volume * width / 3

    const rad=5;
    const gaps = rad*5;
    // var gaps= rad*5;
    const widthCount = parseInt(width); 
    const heightCount = parseInt(height); 
    const aColors=["#114B5F","#028090","#E4FDE1","#456990"];
    const aColorsLength = aColors.length;

    const backgroundProgress = Math.min((now - this.backgroundTick) / 10000, 1)
    ctx.save()
    ctx.globalCompositeOperation = 'overlay'

    for(var x=0; x<widthCount;x++){
      for(var y=0; y<heightCount;y++){
        ctx.fillStyle = aColors[parseInt(Math.random()*aColorsLength)];
        // ctx.fillStyle = interpolateBasis(aColors[parseInt(Math.random()*aColorsLength)])(progress)
        ctx.beginPath();
        ctx.arc(rad+gaps*x,rad+ gaps*y, rad, 0, Math.PI*2, true); 
        ctx.closePath();
        ctx.fill();  
      }
    }

    ctx.restore()

    if (backgroundProgress === 1) {
      this.backgroundTick = now
    }

  //   if (!this.backgroundTick) {
  //     this.backgroundTick = now
  //   }
  //   const { progress } = this.sync.getInterval('section')
  //   const backgroundProgress = Math.min((now - this.backgroundTick) / 10000, 1)
  //   ctx.save()
  //   ctx.globalCompositeOperation = 'overlay'
  //   ctx.fillStyle = interpolateRgbBasis(this.overlayColors)(progress)
  //   // ctx.fillStyle = interpolateRgbBasis(this.overlayColors)(backgroundProgress)
  //   ctx.fillRect(0, 0, width, height)
  //   ctx.restore()

  //   if (backgroundProgress === 1) {
  //     this.backgroundTick = now
  //   }

  }



     

  paint (args) {
    this.paintBackground(args)
    // this.updateCanvas(args)
    // this.paintOuterLines(args)
    this.paintInnerLines(args)
    // this.paintCenter(args)
    this.paintOverlay(args)
    // this.paintRectangles(args)
  }
}