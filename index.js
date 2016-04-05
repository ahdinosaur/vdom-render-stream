var inherits = require('inherits')
var Writable = require('readable-stream/writable')
var vdom = {
  create: require('virtual-dom/create-element'),
  diff: require('virtual-dom/diff'),
  patch: require('virtual-dom/patch')
}
var mainLoop = require('main-loop')

module.exports = VdomRenderStream

inherits(VdomRenderStream, Writable)
function VdomRenderStream (render, element) {
  if (!(this instanceof VdomRenderStream)) {
    return new VdomRenderStream(render, element)
  }

  Writable.call(this, {
    objectMode: true
  })

  this.loop = null
  this.render = render
  this.element = element
}

VdomRenderStream.prototype._write = write

function write (props, enc, cb) {
  if (this.loop === null) {
    this.loop = mainLoop(props, this.render, vdom)
    this.element.appendChild(this.loop.target)
  } else {
    this.loop.update(props)
  }
  //process.nextTick(cb)
  cb()
}
