"use strict";

(function() {
  function itemTrailLabel(item) {
    return `${item.typeLabel} (${item.tuples.length} item${item.tuples.length != 1 ? "s)" : ")"}`;
  }

  function itemTrail(item) {
    const trail = ["Root"];

    if(item.address) {
      for(const address of item.address.full()) trail.push(itemTrailLabel(address.parent));
    }

    if(!item.simple) trail.push(itemTrailLabel(item));

    return trail.join(" > ");
  }

  let currentFocusElement = null;
  function focusObject(element) {
    if(element == currentFocusElement) return;

    currentFocusElement = element;

    const item = window.tree.fromIndex(parseInt(element.dataset.index));

    $("#focus-path").textContent = Util.itemPath(item);
    $("#focus-trail").textContent = itemTrail(item);
    $("#focus-type").textContent = item.typeLabel;
  }

  let currentOutlineElement = null;
  function outlineObject(element) {
    if(element == currentOutlineElement) return;

    if(currentOutlineElement) currentOutlineElement.style.outline = "none";

    currentOutlineElement = element;

    if(element) element.style.outline = "1px solid #ffa000";
  }

  let focusFrozen = false;

  function handleFocus(event) {
    const focusable = event.target.closest("div[data-index], tr[data-index]");
    if(!focusable) return;

    if(event.type == "click") {
      focusFrozen = true;
      focusObject(focusable);
    }
    else if(!focusFrozen) focusObject(focusable);
  }

  function handleOutline(event) {
    const outlinable = event.target.closest("div[data-index]");
    outlineObject(outlinable);
  }

  function handleZoom(event) {
    const element = event.target.parentNode;
    const zoomed = element.parentNode != $("#output");
    const treeNode = zoomed ? window.tree.fromIndex(parseInt(element.dataset.index)) : window.tree.root;
    $("#output").innerHTML = render(treeNode, zoomed);
    if(zoomed) $("#output").firstChild.classList.add("zoomed");
  }

  function handleMinimise(event) {
    const element = event.target.parentNode;
    element.classList.toggle("minimised");

    if(!element.classList.contains("dry")) return;
    const treeNode = window.tree.fromIndex(parseInt(element.dataset.index));
    element.insertAdjacentHTML("beforebegin", render(treeNode));
    element.remove();
  }

  function init() {
    document.body.addEventListener("click", function(event) {
      handleOutline(event);
      handleFocus(event);

      if(event.target.matches(".widget")) handleMinimise(event);
      if(event.target.matches(".zoom")) handleZoom(event);
    });

    document.body.addEventListener("mousemove", function(event) {
      handleOutline(event);
      handleFocus(event);
    });

    document.addEventListener("scroll", function(event) {
      focusFrozen = false;
    });

    $("#reset").addEventListener("click", function(event) {
      $("#focus-path").textContent = "";
      $("#focus-trail").textContent = "";
      $("#focus-type").textContent = "";
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
