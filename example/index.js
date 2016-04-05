var h = require('virtual-dom/virtual-hyperscript/svg')
var getUserMedia = require('getusermedia')
var readAudio = require('read-audio')
var vdomRenderStream = require('../')

var numSamples = 512
var main = document.querySelector('main')

getUserMedia({
  audio: true, video: false
}, function (err, media) {
  // if error getting user media,
  if (err) {
    // blow up
    throw err
  }

  readAudio({
    source: media,
    buffer: numSamples,
    channels: 1
  }).pipe(
    vdomRenderStream(render, main)
  )
})

function render (audio) {
  return h('svg', {
    width: '100%',
    height: '100%',
    viewBox: '0 -1 '+numSamples+' 2',
    preserveAspectRatio: 'none',
  }, [
    h('polyline', {
      stroke: 'black',
      'stroke-width': '0.005',
      fill: 'transparent',
      points: getPoints(audio).join(' ')
    })
  ])
}

function getPoints(audio) {
  // cheap code for single channel audio
  var length = audio.shape[0]
  var points = new Array(length)
  for (var t = 0; t < length; ++t) {
    points[t] = t + ',' + audio.data[t]
  }
  return points
}
