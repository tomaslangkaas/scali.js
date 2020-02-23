(function(window) {
  window.scali = scali;
  scali.version = "v0.1.0";
  scali.mixins = {};

  var PROPERTIES = ["bottom", "left", "top", "right", "width", "height"];

  function scali(params, parent) {
    var illustration = {scale: scale},
      i;
    for (i in scali.mixins) {
      illustration[i] = scali.mixins[i];
    }
    illustration.shape = shape;
    illustration.content = content;
    illustration.root = appendHTML(
      parent,
      create(
        "div",
        position(params) + "position:" + (params.position || "relative") + ";"
      )
    );
    return illustration;
  }

  function scale(factor) {
    this.root.style.fontSize = factor === 1 ? "" : factor + "em";
  }

  function shape(params) {
    var direction =
      { right: 1, down: 2, left: 3 }[params.d] || params.d | 0;
    return appendHTML(this.root, create('div',
      position(params) +
      "position:absolute;" +
      "border:0 solid transparent;" +
      "line-height:0;" + // IE6
      "_border-color:" +
      (params.chroma || "#FDFCFE") +
      ";" + // IE6
      "_filter:chroma(color=" +
      (params.chroma || "#FDFCFE") +
      ");" + // IE6
        "border-" +
        PROPERTIES[direction] +
        ":" +
        unit(params.h) +
        " solid " +
        params.color +
        ";" +
        "border-" +
        PROPERTIES[(direction + 1) & 3] +
        "-width:" +
        unit(params.a) +
        ";" +
        "border-" +
        PROPERTIES[(direction + 3) & 3] +
        "-width:" +
        unit(params.c) +
        ";" +
        PROPERTIES[4 + (direction & 1)] +
        ":" +
        unit(params.b) +
        ";" +
        PROPERTIES[5 - (direction & 1)] +
        ":0;"
    ));
  }

  function content(params) {
    var CONTENT_CSS = "display:inline-block;zoom:1;*display:inline;";

    return appendHTML(this.root, create(
      "div",
      position(params) +
        "position:absolute;" +
        "text-align:" +
        (params.h || "left") +
        ";",
      create(
        "div",
        CONTENT_CSS + "height:100%;vertical-align:middle;"
      ) + create("div", CONTENT_CSS +
        "vertical-align:" +
        (params.v || "top") +
        ";" + [params.csstext], params.html)
    ));
  }

  function position(params) {
    var css = "" + [params.css],
      i;
    for (i = 0; i < 6; i++) {
      PROPERTIES[i] in params &&
        (css += PROPERTIES[i] + ":" + unit(params[PROPERTIES[i]]) + ";");
    }
    return css;
  }

  function appendHTML(parent, html) {
    if (parent.insertAdjacentHTML) {
      parent.insertAdjacentHTML("beforeend", html);
    } else {
      parent.innerHTML = parent.innerHTML + html;
    }
    return parent.lastChild;
  }

  function create(tag, style, content) {
    return (
      "<" + tag + ' style="' + [style] + '">' + [content] + "</" + tag + ">"
    );
  }

  function unit(n) {
    return typeof n === "string" ? n : n / 16 + "em";
  }

})(this);
