const async = require("async")
const MicroApi = require('./microapi')

let uniqId = 0

module.exports = function(){
  this.$handlers = []
  this.$defaultHandlers = []
}

module.exports.prototype.createReactionData = function(pattern, handler) {
  if(pattern instanceof RegExp) {
    return {
      id: uniqId++,
      originalPattern: pattern,
      pattern: pattern,
      handler: handler
    }
  }

  var placeholderPattern = /:(\w+)\b/g
  var optionParts = []
  var original = pattern
  var m = pattern.match(placeholderPattern)
  if(m) {
    for(var i = 0; i<m.length; i++) {
      var placeholder = m[i]
      optionParts.push(placeholder.substr(1))
      pattern = pattern.replace(placeholder, "(\\S+)")
    }
  }

  return {
    id: uniqId++,
    originalPattern: original,
    pattern: RegExp("^"+pattern+"$"),
    optionParts: optionParts,
    handler: handler
  }
}

module.exports.prototype.off = function(data) {
  for(var i = 0;i<this.$handlers.length; i++) {
    if(data.id == this.$handlers[i].id) {
      this.$handlers.splice(i, 1)
      i -= 1
    }
  }
}

module.exports.prototype.on = function(pattern, handler) {
  var data = this.createReactionData(pattern, handler)
  this.$handlers.push(data)
  return new MicroApi(data, this)
}

module.exports.prototype.once = function(pattern, handler) {
  var data = this.createReactionData(pattern, handler)
  data.once = true
  this.$handlers.push(data)
  return new MicroApi(data, this)
}

module.exports.prototype.do = async function(input) {
  var handlersChain = []

  for(var i = 0; i<this.$handlers.length; i++) {
    var matched = input.match(this.$handlers[i].pattern)
    if(matched) {
      if(this.$handlers[i].optionParts &&
        matched.length-1 == this.$handlers[i].optionParts.length) {
        var handler = this.$handlers[i].handler
        var optionParts = this.$handlers[i].optionParts
        if(this.$handlers[i].once) {
          this.$handlers.splice(i, 1)
        }
        var options = {}
        for(var k = 0; k<optionParts.length; k++) {
          if(matched[k+1]) {
            options[optionParts[k]] = matched[k+1]
          }
        }
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

  if(handlersChain.length == 0) {
    if (this.$defaultHandlers.length > 0) {
      return new Promise((resolve, reject) => {
        const results = []
        async.eachSeries(this.$defaultHandlers, async function (handler) {
          let r = await handler(input)
          results.push(r)
        }, function (err) {
          if (err) return reject(err)
          resolve(results)
        })
      })
    }
    throw new Error("no handlers found about '" + input + "'")
  }

  if(handlersChain.length == 1) {
    var pair = handlersChain[0]
    return pair.handler(pair.options)
  }

  return new Promise((resolve, reject) => {
    var results = []
    async.eachSeries(handlersChain, async function (pair, n) {
      const result = await pair.handler(pair.options)
      results.push(result)
      n && n()
    }, function (err) {
      if (err) return reject(err)
      resolve(results)
    })
  })
}
