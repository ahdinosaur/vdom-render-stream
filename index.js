var inherits = require('inherits')
var Writable = require('readable-stream/writable')
var vdom = {
  create: require('virtual-dom/create-element'),
  diff: require('virtual-dom/diff'),
  patch: require('virtual-dom/patch')
}

module.exports = VdomRenderStream

inherits(VdomRenderStream, Writable)
function VdomRenderStream (render, container) {
  if (!(this instanceof VdomRenderStream)) {
    return new VdomRenderStream(render, container)
  }

  Writable.call(this, {
    objectMode: true
  })

  this.tree = null
  this.element = null
  this.render = render
  this.container = container
}

VdomRenderStream.prototype._write = write

function write (state, enc, cb) {
  // init
  if (this.tree === null) {
    this.tree = this.render(state)
    this.element = vdom.create(this.tree)
    this.container.appendChild(this.element)
  }
  // update
  else {
    var nextTree = this.render(state)
    var patches = vdom.diff(this.tree, nextTree)
    this.element = vdom.patch(this.element, patches)
    this.tree = nextTree
  }

  cb()
}
