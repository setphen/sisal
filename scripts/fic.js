var Fic = function(params) {
  this.element = document.getElementById(params.element)

  this.element.classList.add("fic-content")

  this.tokenize = function(token) {
    return token.toLowerCase().replace(/ /g, '_')
  }

  this.parseNode = function(s) {

    var node = document.createElement('div');
    var tokens = s.match(/[^{}]+(?=\})/g)

    output = s

    if (tokens){
      tokens.forEach(function(token, index){
        // check if token is a link (ie. broken by {text|key})
        if (/\|/g.test(token)) {
          var split = token.split("|")
          var text = split[0].trim()
          var key = split[1].trim()
        } else {
          var key = token.trim()
          var text = key
        }

        var link = `<a data-link="${this.tokenize(key)}">${text}</a>`
        var e = `{${token}}`
        output = output.replace(e, link)
      }.bind(this))
    }

    return output
  }

  this.parseStory = function(rawinput) {
    var re = /(?=.)[^::]+/g
    var nodes = rawinput.match(re)
    var story = {}

    nodes.forEach(function(node, index){
      var split = node.trim().split(/\n/)
      var node = split.slice(1).join(' ')
      story[this.tokenize(split[0])] = node
    }.bind(this))

    return story
  }

  this.story = this.parseStory(params.raw_story)

  this.parseStory = function(rawinput) {
    var re = /(?=.)[^::]+/g
    var nodes = rawinput.match(re)
    var story = {}

    nodes.forEach(function(node, index){
      var split = node.trim().split(/\n/)
      var node = this.parseNode(split.slice(1).join(' '))
      story[this.tokenize(split[0])] = node
    })

    return story
  }

  this.jump = function(node) {
    html = this.parseNode(this.story[node])
    this.element.classList.add("fic-content-exit")
    window.setTimeout(() => {
      this.element.innerHTML = html
      this.element.querySelectorAll("[data-link]").forEach((node) => {
        node.addEventListener('click', () => {
          this.jump(node.dataset.link)
        })
      })
      this.element.classList.remove("fic-content-exit")
    }, 400)
  }
}
