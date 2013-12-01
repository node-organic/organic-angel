var async = require("async")
var _ = require("underscore")

var MicroApi = function(data, reactor){
  this.data = data
  this.reactor = reactor
}

_.extend(MicroApi.prototype,{
  example: function(value){
    this.data['example'] = value
    return this
  },
  description: function(value) {
    this.data['description'] = value
    return this
  },
  set: function(key, value){
    this.data[key] = value
    return this
  },
  off: function(){
    this.reactor.off(this.data)
  }
})

module.exports = function(){
  this.$handlers = []
}

module.exports.prototype.createReactionData = function(pattern, handler) {
  if(pattern instanceof RegExp)
    return {
      id: _.uniqueId(),
      originalPattern: pattern,
      pattern: pattern,
      handler: handler
    }

  var placeholderPattern = /:([a-zA-Z0-9\\\(\)\|\.\*\]\[\?=]+)/g
  var optionParts = []
  var original = pattern
  var m = pattern.match(placeholderPattern)
  var optionalParts = 0
  if(m)
    for(var i = 0; i<m.length; i++) {
      var placeholder = m[i]
      if(placeholder.indexOf("?") == placeholder.length-1) {
        placeholder = placeholder.substr(0, placeholder.length-1)
        optionalParts += 1
      }
      if(placeholder.match(/\(*.\)/)) {
        var mm = placeholder.match(/(.*)\(/)[1].substr(1)
        optionParts.push(mm)
        pattern = pattern.replace(/ :([a-zA-Z0-9\?]+)\(/, "\\s?(")  
      } else {
        optionParts.push(placeholder.substr(1))
        pattern = pattern.replace(" "+placeholder, "\\s?([a-zA-Z0-9/\\\\-_.\\+;:=\\+\\-~\\(\\)]+)")
      }
    }

  return {
    id: _.uniqueId(),
    originalPattern: original,
    pattern: RegExp("^"+pattern+"$"),
    optionParts: optionParts,
    optionalParts: optionalParts,
    handler: handler
  } 
}

module.exports.prototype.off = function(data) {
  for(var i = 0;i<this.$handlers.length; i++)
    if(data.id == this.$handlers[i].id) {
      this.$handlers.splice(i, 1)
      i -= 11
    }
}

module.exports.prototype.on = function(pattern, handler) {
  var data = this.createReactionData(pattern, handler)
  this.$handlers.push(data)
  return new MicroApi(data, this)
}

module.exports.prototype.once = function(pattern, handler) {
  var data = _.extend(this.createReactionData(pattern, handler), {once: true})
  this.$handlers.push(data)
  return new MicroApi(data, this)
}

module.exports.prototype.do = function(input, next) {
  var handlersChain = []

  for(var i = 0; i<this.$handlers.length; i++) {
    var matched = input.match(this.$handlers[i].pattern)
    if(matched) {
      if(this.$handlers[i].optionParts && 
        matched.length-1 == this.$handlers[i].optionParts.length) {
        var handler = this.$handlers[i].handler
        var optionParts = this.$handlers[i].optionParts
        if(this.$handlers[i].once)
          this.$handlers.splice(i, 1)
        var options = {}
        for(var k = 0; k<optionParts.length; k++)
          if(matched[k+1])
            options[optionParts[k]] = matched[k+1]
        handlersChain.push({
          options: options,
          handler: handler
        })
      } else {
        handlersChain.push({
          options: matched,
          handler: this.$handlers[i].handler
        })
      }
    }
  }
  if(handlersChain.length == 0) return next(new Error("no handlers found"))
  if(handlersChain.length == 1) {
    var pair = handlersChain[0]
    return pair.handler(pair.options, next)
  }
  var lastResult = null
  async.eachSeries(handlersChain, function(pair, n){
    pair.handler(pair.options, function(err, result){
      if(err) return n(err)
      lastResult = result
      n()
    })
  }, function(err){
    if(err) return next(err)
    next(null, lastResult)
  })
}