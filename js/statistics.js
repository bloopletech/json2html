"use strict";

window.renderStatistics = function(node, text) {
  function gather(root) {
    let elementCount = 0;
    let arrayCount = 0;
    let objectCount = 0;

    function visit(node) {
      elementCount++;
      if(node.simple) return;

      if(node.type == "array") arrayCount++;
      else if(node.type == "object") objectCount++;

      node.tuples.forEach(function(tuple) {
        visit(tuple.value);
      });
    }

    visit(root);

    return {
      elementCount: elementCount,
      arrayCount: arrayCount,
      objectCount: objectCount
    };
  };

  function render(result, text) {
    const textByteLength = Util.byteLength(text);
    return "<div id='stats'><h3>Statistics</h3>\n<table>\n<tr>\n<td>Number of Arrays:</td>\n<td>"
      + Util.format(result.arrayCount) + "</td>\n</tr>\n"
      + "<tr>\n<td>Number of Objects:</td>\n<td>" + Util.format(result.objectCount) + "</td>\n</tr>\n"
       + "<tr>\n<td>Total number of all elements:</td>\n<td>" + Util.format(result.elementCount) + "</td>\n</tr>\n"
        + "<tr>\n<td>Nesting depth:</td>\n<td>" + Util.format(tree.nestingLevel) + "</td>\n</tr>\n"
        + "<tr>\n<td>Size of JSON document (UTF-8 bytes):</td>\n<td>" + Util.humanFileSize(textByteLength) + " ("
        + Util.format(textByteLength) + " B)</td>\n</tr>\n"
        + "<tr>\n<td>Size of JSON document (UTF-16 code units):</td>\n<td>" + Util.humanFileSize(text.length) + " ("
        + Util.format(text.length) + " B)</td>\n</tr>\n"
        + "</table>\n</div>\n";
  }

  return render(gather(node), text);
};
