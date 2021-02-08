"use strict";

window.render = function(root, targeted) {
  const LARGE_RENDER_COUNT_CUTOFF = 250; // 250 nodes
  let renderCount = 0;

  function renderTuples(node) {
    const nameColumnName = node.type == "array" ? "Index" : "Name";
    let out = `<table><tr><th>${nameColumnName}</th><th>Value</th></tr>`;

    for(const tuple of node.tuples) {
      const value = tuple.value;
      out += `<tr data-index='${value.index}'><td>${e(tuple.name)}</td>`;
      out += `<td class='${value.type}'${(value.simple ? ` title='${value.typeLabel}'` : "")}>`;

      if(value.simple) out += e(value.value);
      else if(value.type == "array") out += renderArray(value);
      else if(value.type == "object") out += renderObject(value);

      out += "</td></tr>";
    }

    out += "</table>";
    return out;
  }

  function renderArray(array) {
    renderCount++;
    const pathText = array == root && targeted ? ` <code>${e(Util.itemPath(root))}</code>` : "";
    if(!array.tuples.length) return `<div data-index='${array.index}'>(empty Array${pathText})</div>`;

    const minimised = renderCount >= LARGE_RENDER_COUNT_CUTOFF;

    let out = `<div class='array${(minimised ? " minimised dry" : "")}' data-index='${array.index}'><div class='widget'></div><div class='zoom'></div><h3>Array${pathText}</h3>`;
    if(!minimised) out += renderTuples(array);
    out += "</div>";
    return out;
  }

  function renderObject(object) {
    renderCount++;
    const pathText = object == root && targeted ? ` <code>${e(Util.itemPath(root))}</code>` : "";
    if(!object.tuples.length) return `<div data-index='${object.index}'>(empty Object${pathText})</div>`;

    const minimised = renderCount >= LARGE_RENDER_COUNT_CUTOFF;

    let out = `<div class='object${(minimised ? " minimised dry" : "")}' data-index='${object.index}'><div class='widget'></div><div class='zoom'></div><h3>Object${pathText}</h3>`;
    if(!minimised) out += renderTuples(object);
    out += "</div>";
    return out;
  }

  if(root.type == "array") return renderArray(root);
  if(root.type == "object") return renderObject(root);
  return `<span class='${root.type}' title='${root.typeLabel}'>${e(root.value)}</span>`;
};
