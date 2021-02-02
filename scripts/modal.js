"use strict";

window.Modal = (function() {
  function show(content) {
    $("#modal-content").innerHTML = content;
    document.body.classList.add("modal-open");
  }

  function hide() {
    $("#modal-content").innerHTML = "";
    document.body.classList.remove("modal-open");

    const event = new Event("modal-hide");
    document.body.dispatchEvent(event);
  }

  var TEMPLATE = `
    <div id="modal-backdrop">
      <div id="modal">
        <a href="#" id="modal-close">&times;</a>
        <div id="modal-content"></div>
      </div>
    </div>
  `;

  function init() {
    document.body.insertAdjacentHTML("beforeend", TEMPLATE);

    document.body.addEventListener("click", function(e) {
      if(e.target.matches("#modal-close")) {
        e.preventDefault();
        hide();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    show: show,
    hide: hide
  };
})();
