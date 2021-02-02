"use strict";

(function() {
  function itemPath(item) {
    var path = ["<root>"];

    if(item.address) {
      item.address.full().forEach(function(address) {
        path.push(address.parent.type == "array" ? "[" + address.prop + "]" : "." + address.prop);
      });
    }

    return path.join("");
  }

  function itemTrailLabel(item) {
    return item.typeLabel + " (" + item.tuples.length + " item" + (item.tuples.length != 1 ? "s)" : ")");
  }

  function itemTrail(item) {
    var trail = ["Root"];

    if(item.address) {
      item.address.full().forEach(function(address) {
        trail.push(itemTrailLabel(address.parent));
      });
    }

    if(!item.simple) trail.push(itemTrailLabel(item));

    return trail.join(" > ");
  }

  var currentFocusElement = null;
  function focusObject(element) {
    if(element == currentFocusElement) return;

    currentFocusElement = element;

    var item = window.tree.fromIndex(parseInt(element.dataset.index));

    $("#focus-path").textContent = itemPath(item);
    $("#focus-trail").textContent = itemTrail(item);
  }

  var currentOutlineElement = null;
  function outlineObject(element) {
    if(element == currentOutlineElement) return;

    if(currentOutlineElement) currentOutlineElement.style.outline = "none";

    currentOutlineElement = element;

    if(element) element.style.outline = "1px solid #ffa000";
  }

  function handleFocusOutline(event) {
    var focusable = event.target.closest("div[data-index], tr[data-index]");
    if(focusable) focusObject(focusable);

    var outlinable = event.target.closest("div[data-index]");
    outlineObject(outlinable);
  }

  function init() {
    document.body.addEventListener("click", function(event) {
      handleFocusOutline(event);

      if(event.target.matches(".widget")) event.target.parentNode.classList.toggle("minimised");
    });

    document.body.addEventListener("mousemove", handleFocusOutline);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
