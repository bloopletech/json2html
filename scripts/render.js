"use strict";

window.render = function(root) {
  var elementCount = 0;
  var arrayCount = 0;
  var objectCount = 0;
  var renderCount = 0;

  function renderTuples(tuples) {
    var out = "";

    tuples.forEach(function(tuple) {
      var value = tuple.value;
      out += "<tr data-index='" + value.index + "'><td>" + Util.escapeHTML(tuple.name) + "</td>";
      out += "<td class='" + value.type + "'" + (value.simple ? " title='" + value.typeLabel + "'" : "") + ">";

      if(value.simple) {
        elementCount++;
        out += Util.escapeHTML(value.value);
      }
      else if(value.type == "array") {
        out += renderArray(value);
      }
      else if(value.type == "object") {
        out += renderObject(value);
      }
      out += "</td></tr>";
    });

    return out;
  }

  function renderArray(array) {
    elementCount++;
    arrayCount++;
    renderCount++;
    if(!array.tuples.length) return "<div data-index='" + array.index + "'>(empty Array)</div>";

    var out = "<div class='array" + (renderCount >= 1000 ? " minimised" : "") + "' data-index='" + array.index + "'><div class='widget'></div><h3>Array</h3>";
    out += "<table><tr><th>Index</th><th>Value</th></tr>";
    out += renderTuples(array.tuples);
    out += "</table></div>";
    return out;
  }

  function renderObject(object) {
    elementCount++;
    objectCount++;
    renderCount++;
    if(!object.tuples.length) return "<div data-index='" + object.index + "'>(empty Object)</div>";

    var out = "<div class='object" + (renderCount >= 1000 ? " minimised" : "") + "' data-index='" + object.index + "'><div class='widget'></div><h3>Object</h3>";
    out += "<table><tr><th>Name</th><th>Value</th></tr>";
    out += renderTuples(object.tuples);
    out += "</table></div>";
    return out;
  }

  function renderDocument(val) {
    if(val.type == "array") return renderArray(val);
    if(val.type == "object") return renderObject(val);
    elementCount++;
    return "<span class='" + val.type + "' title='" + value.typeLabel + "'>" + Util.escapeHTML(val.value) + "</span>";
  }

  var output = renderDocument(root);

  return {
    output: output,
    elementCount: elementCount,
    arrayCount: arrayCount,
    objectCount: objectCount,
    renderCount: renderCount
  };
};
