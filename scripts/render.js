"use strict";

window.render = function(root, targeted) {
  const LARGE_RENDER_COUNT_CUTOFF = 250; // 250 nodes
  let renderCount = 0;

  function renderTuples(node) {
    let out = `<table><tr><th>${node.keyLabel}</th><th>Value</th></tr>`;

    for(const tuple of node.tuples) {
      const value = tuple.value;
      out += `<tr data-index='${value.index}'><td>${e(tuple.name)}</td>`;
      out += `<td class='${value.type}'${(value.simple ? ` title='${value.typeLabel}'` : "")}>`;

      if(value.simple) out += e(value.value);
      else out += renderNode(value);

      out += "</td></tr>";
    }

    out += "</table>";
    return out;
  }

  function renderNode(node) {
    renderCount++;
    const pathText = node == root && targeted ? ` <code>${e(Util.itemPath(root))}</code>` : "";
    if(!node.tuples.length) return `<div data-index='${node.index}'>(empty ${node.typeLabel}${pathText})</div>`;

    const minimised = renderCount >= LARGE_RENDER_COUNT_CUTOFF;

    let out = `<div class='${node.type}${(minimised ? " minimised dry" : "")}' data-index='${node.index}'><div class='widget'></div><div class='zoom'></div><h3>${node.typeLabel}${pathText}</h3>`;
    if(!minimised) out += renderTuples(node);
    out += "</div>";
    return out;
  }

  if(root.simple) return `<div class='${root.type}' title='${root.typeLabel}'>${e(root.value)}</siv>`;
  return renderNode(root);
};
