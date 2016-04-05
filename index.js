var inherits = require('inherits')
var Writable = require('readable-stream/writable')
var vdom = {
  create: require('virtual-dom/create-element'),
  diff: require('virtual-dom/diff'),
  patch: require('virtual-dom/patch')
}
var vraf = require('virtual-raf')

module.exports = VdomRenderStream

inherits(VdomRenderStream, Writable)
function VdomRenderStream (render, element) {
  if (!(this instanceof VdomRenderStream)) {
    return new VdomRenderStream(render, element)
  }

  Writable.call(this, {
    objectMode: true
  })

  this.tree = null
  this.render = render
  this.element = element
}

VdomRenderStream.prototype._write = write

function write (props, enc, cb) {
  if (this.tree === null) {
    this.tree = vraf(props, this.render, vdom)
    this.element.appendChild(this.tree.render())
  } else {
    this.tree.update(props)
  }
  //process.nextTick(cb)
  cb()
}
