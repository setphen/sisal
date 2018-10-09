var Fic = function(params) {
  this.element = document.getElementById(params.element)

  this.parseNode = function(s) {
    var node = document.createElement('div');
    var tokens = s.match(/[^{}]+(?=\})/g)

    output = s

    this.tokenize = function(token) {
      return token.toLowerCase().replace(/ /g, '_')
    }

    if (tokens){
      tokens.forEach(function(token, index){
        // check if token is a split link, i.e. {{ text | key }}
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
      var node = this.parseNode(split.slice(1).join(' '))
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
    this.render(this.story[node])
  }

  this.render = function(html) {
    this.element.classList.add("fic-exit")
    window.setTimeout(() => {
      this.element.innerHTML = html
      this.element.querySelectorAll("[data-link]").forEach((node) => {
        node.addEventListener('click', () => {
          this.jump(node.dataset.link)
        })
      })
      this.element.classList.remove("fic-exit")
    }, 300)
  }
}

var rawinput = `
::mountain

You are looking out over the { green plains | plains }.

::plains

In front of you the { rugged mountain | mountain } ascends to the sky.
`

fiction = new Fic({element: "Fic", raw_story: rawinput})
fiction.jump('mountain')
