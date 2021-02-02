"use strict";

window.Util = (function() {
  function format(input) {
    var type = typeof input;
    if(type == "number") return input.toLocaleString();
    return input;
  }

  function escapeHTML(unsafe) {
    if(unsafe == null) return "";
    return unsafe.toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatThenEscape(input) {
    return escapeHTML(format(input));
  }

  return {
    format: format,
    escapeHTML: escapeHTML,
    formatThenEscape: formatThenEscape
  }
})();

window.e = Util.escapeHTML;
window.ef = Util.formatThenEscape;
