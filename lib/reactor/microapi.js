module.exports = function(data, reactor){
  this.data = data
  this.reactor = reactor
}

module.exports.prototype.example = function(value){
  this.data['example'] = value
  return this
},
module.exports.prototype.description = function(value) {
  this.data['description'] = value
  return this
},
module.exports.prototype.set = function(key, value){
  this.data[key] = value
  return this
},
module.exports.prototype.off = function(){
  this.reactor.off(this.data)
}
