"use strict";

var HELP_CONTENT = null;
var tree = null;
var statsContent = null;

function doStats(result, text) {
  var textByteLength = Util.byteLength(text);
  var out = "<div id='stats'><h3>Statistics</h3>\n<table>\n<tr>\n<td>Number of Arrays:</td>\n<td>"
    + Util.format(result.arrayCount) + "</td>\n</tr>\n"
    + "<tr>\n<td>Number of Objects:</td>\n<td>" + Util.format(result.objectCount) + "</td>\n</tr>\n"
     + "<tr>\n<td>Total number of all elements:</td>\n<td>" + Util.format(result.elementCount) + "</td>\n</tr>\n"
      + "<tr>\n<td>Nesting depth:</td>\n<td>" + Util.format(tree.nestingLevel) + "</td>\n</tr>\n"
      + "<tr>\n<td>Size of JSON document (UTF-8 bytes):</td>\n<td>" + Util.humanFileSize(textByteLength, true) + " ("
      + Util.format(textByteLength) + " B)</td>\n</tr>\n"
      + "<tr>\n<td>Size of JSON document (UTF-16 code units):</td>\n<td>" + Util.humanFileSize(text.length, true) + " ("
      + Util.format(text.length) + " B)</td>\n</tr>\n"
      + "</table>\n</div>\n";
  return out;
}

function enableSubmit() {
  $("#submit").value = "json 2 html";
  $("#submit").disabled = null;
}

function parse(str) {
  try {
    return JSON.parse(str);
  }
  catch(e) {
    if(e instanceof SyntaxError) {
      alert("There was a syntax error in your JSON string.\n" + e.message + "\nPlease check your syntax and try again.");
    }
    else {
      alert("There was an unknown error. Perhaps the JSON string contained a deep level of nesting.");
    }

    enableSubmit();
    $("#text").focus();
    return;
  }
}

function json2html(str) {
  var parseTree = parse(str);
  if(!parseTree) return;
  tree = transformTree(parseTree);
  var result = render(tree.root);

  $("#output").innerHTML = result.output;

  statsContent = doStats(result, str);
  $("#show-stats").disabled = null;

  enableSubmit();

  $("#output").scrollIntoView();
}

function doParse() {
  $("#submit").value = "processing...";
  $("#submit").disabled = "disabled";
  $("#show-stats").disabled = "disabled";

  setTimeout(doParse2, 50);
}

function doParse2() {
  var value = $("#text").value != "" ? $("#text").value : window.offscreenText;
  if(value.substr(0, 4) == "http" || value.substr(0, 4) == "file" || value.substr(0, 3) == "ftp") {
    getURL(value);
  }
  else {
    json2html(value);
  }
}

function getURL(str) {
  var http = new XMLHttpRequest();
  http.open("get", "get.php?url=" + str);
  http.onreadystatechange = function() {
    if(http.readyState == 4) json2html(http.responseText);
  };
  http.send(null);
}

var LARGE_DOCUMENT_CUTOFF = 150 * 1024; // 150K "UTF-16 code units"

function onTextPaste(event) {
  // If the textarea already has text in it, then allow the browser to handle the paste normally, because the user's
  // intent might be to paste a fragment of JSON to amend existing text, rather than completely replacing what is in
  // the textarea with a complete JSON document.
  if($("#text").value != "") return;

  // Get text representation of clipboard
  var text = (event.originalEvent || event).clipboardData.getData("text/plain");

  // If the JSON document to be pasted is small enough that it won't negatively impact performance, then allow the
  // browser to handle the paste normally; this way the user can edit the JSON document in the textarea.
  if(text.length <= LARGE_DOCUMENT_CUTOFF) return;

  // Cancel browser default paste behaviour. The default behaviour, laying out and rendering the string inside the
  // textarea, is the performance expensive operation; so skip it.
  event.preventDefault();

  window.offscreenText = text;
  $("#text").placeholder = "[Large JSON document of size " + Util.humanFileSize(Util.byteLength(text), true) +
    " successfully pasted; display of the document skipped for performance]";
}

function onTextChanged(event) {
  if($("#text").value == "") return;
  window.offscreenText = null;
  $("#text").removeAttribute("placeholder");
}

function init() {
  window.$ = document.querySelector.bind(document);

  HELP_CONTENT = $("#help-content").innerHTML;
  $("#help-content").remove();

  $("#text").addEventListener("paste", onTextPaste);
  $("#text").addEventListener("input", onTextChanged);

  $("#reset").addEventListener("click", function(event) {
    statsContent = "";
    $("#output").innerHTML = "";
  });

  $("#show-stats").addEventListener("click", function(event) {
    Modal.show(statsContent);
  });

  $("#show-help").addEventListener("click", function(event) {
    Modal.show(HELP_CONTENT);
  });

  if($("#text").focus) $("#text").focus();
}

document.addEventListener("DOMContentLoaded", init);