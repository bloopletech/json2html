"use strict";

window.render = function(root, targeted) {
  var LARGE_RENDER_COUNT_CUTOFF = 250; // 250 nodes
  var elementCount = 0;
  var arrayCount = 0;
  var objectCount = 0;
  var renderCount = 0;

  function renderTuples(node) {
    var nameColumnName = node.constructor.name == "TreeArray" ? "Index" : "Name";
    var out = "<table><tr><th>" + nameColumnName + "</th><th>Value</th></tr>";

    node.tuples.forEach(function(tuple) {
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

    out += "</table>";
    return out;
  }

  function renderArray(array) {
    elementCount++;
    arrayCount++;
    renderCount++;
    var pathText = array == root && targeted ? " <code>" + Util.escapeHTML(Util.itemPath(root)) + "</code>" : "";
    if(!array.tuples.length) return "<div data-index='" + array.index + "'>(empty Array" + pathText + ")</div>";

    var minimised = renderCount >= LARGE_RENDER_COUNT_CUTOFF;

    var out = "<div class='array" + (minimised ? " minimised dry" : "") + "' data-index='" +
      array.index + "'><div class='widget'></div><div class='zoom'></div><h3>Array" + pathText + "</h3>";
    if(!minimised) out += renderTuples(array);
    out += "</div>";
    return out;
  }

  function renderObject(object) {
    elementCount++;
    objectCount++;
    renderCount++;
    var pathText = object == root && targeted ? " <code>" + Util.escapeHTML(Util.itemPath(root)) + "</code>" : "";
    if(!object.tuples.length) return "<div data-index='" + object.index + "'>(empty Object" + pathText + ")</div>";

    var minimised = renderCount >= LARGE_RENDER_COUNT_CUTOFF;

    var out = "<div class='object" + (minimised ? " minimised dry" : "") + "' data-index='" +
      object.index + "'><div class='widget'></div><div class='zoom'></div><h3>Object" + pathText + "</h3>";
    if(!minimised) out += renderTuples(object);
    out += "</div>";
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
