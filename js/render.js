"use strict";

window.render = function(root, targeted) {
  const LARGE_RENDER_COUNT_CUTOFF = 250; // 250 nodes
  let renderCount = 0;

  function renderValue(value) {
    if(value.extendedType == "url") return `<a href='${e(value.value)}' target='blank'>${e(value.value)}</a>`;
    return e(value.value);
  }

  function renderTitle(value) {
    if(value.extendedType == "timestamp") {
      return `${value.typeLabel} (${value.extendedTypeLabel}) In local time: ${Util.formatTimestamp(value.value)}`;
    }
    if(value.extendedType) return `${value.typeLabel} (${value.extendedTypeLabel})`;
    return value.typeLabel;
  }

  function renderTuples(node) {
    let out = `<table><tr><th>${node.keyLabel}</th><th>Value</th></tr>`;

    for(const tuple of node.tuples) {
      const value = tuple.value;
      out += `<tr data-index='${value.index}'><td>${e(tuple.name)}</td>`;
      if(value.simple) out += `<td class='${value.type}' title='${renderTitle(value)}'>`;
      else out += `<td class='${value.type}'>`;

      if(value.simple) out += renderValue(value);
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

  if(root.simple) {
    const title = root.extendedType ? `${root.typeLabel} (${root.extendedTypeLabel})` : root.typeLabel;
    return `<div class='${root.type}' title='${title}' data-index='${root.index}'>${renderValue(root)}</siv>`;
  }
  return renderNode(root);
};
