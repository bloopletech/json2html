"use strict";

let HELP_CONTENT = null;
var tree = null;
let statsContent = null;

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
  const parseTree = parse(str);
  if(!parseTree) return;
  tree = transformTree(parseTree);

  $("#output").innerHTML = render(tree.root);

  statsContent = renderStatistics(str);
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
  const value = $("#text").value != "" ? $("#text").value : window.offscreenText;
  if(value.substr(0, 4) == "http" || value.substr(0, 4) == "file" || value.substr(0, 3) == "ftp") {
    getURL(value);
  }
  else {
    json2html(value);
  }
}

function getURL(str) {
  const http = new XMLHttpRequest();
  http.open("get", "get.php?url=" + str);
  http.onreadystatechange = function() {
    if(http.readyState == 4) json2html(http.responseText);
  };
  http.send(null);
}

const LARGE_DOCUMENT_CUTOFF = 150 * 1024; // 150K "UTF-16 code units"

function onTextPaste(event) {
  // If the textarea already has text in it, then allow the browser to handle the paste normally, because the user's
  // intent might be to paste a fragment of JSON to amend existing text, rather than completely replacing what is in
  // the textarea with a complete JSON document.
  if($("#text").value != "") return;

  // Get text representation of clipboard
  const text = (event.originalEvent || event).clipboardData.getData("text/plain");

  // If the JSON document to be pasted is small enough that it won't negatively impact performance, then allow the
  // browser to handle the paste normally; this way the user can edit the JSON document in the textarea.
  if(text.length <= LARGE_DOCUMENT_CUTOFF) return;

  // Cancel browser default paste behaviour. The default behaviour, laying out and rendering the string inside the
  // textarea, is the performance expensive operation; so skip it.
  event.preventDefault();

  window.offscreenText = text;
  $("#text").placeholder = "[Large JSON document of size " + Util.humanFileSize(Util.byteLength(text)) +
    " successfully pasted; display of the document skipped for performance]";
}

function onTextChanged(event) {
  if($("#text").value == "") return;
  window.offscreenText = null;
  $("#text").removeAttribute("placeholder");
}

function onTextDrag(event) {
  event.stopPropagation();
  event.preventDefault();
  // Style the drag-and-drop as a "copy file" operation.
  event.dataTransfer.dropEffect = "copy";
}

function onTextDrop(event) {
  event.stopPropagation();
  event.preventDefault();

  const fileList = event.dataTransfer.files;
  const file = fileList[0];
  if(!file) return;

  if(file.type != "text/plain" && file.type != "application/json") return;

  const reader = new FileReader();
  reader.addEventListener("load", function(event) {
    const text = event.target.result;

    if(text.length > LARGE_DOCUMENT_CUTOFF) {
      window.offscreenText = text;
      $("#text").value = "";
      $("#text").placeholder = "[Large JSON document of size " + Util.humanFileSize(Util.byteLength(text)) +
        " successfully pasted; display of the document skipped for performance]";
    }
    else {
      $("#text").value = text;
      window.offscreenText = null;
      $("#text").removeAttribute("placeholder");
    }
  });

  reader.readAsText(file);
}

function init() {
  window.$ = document.querySelector.bind(document);

  HELP_CONTENT = $("#help-content").innerHTML;
  $("#help-content").remove();

  $("#text").addEventListener("paste", onTextPaste);
  $("#text").addEventListener("input", onTextChanged);
  $("#text").addEventListener("dragover", onTextDrag);
  $("#text").addEventListener("drop", onTextDrop);

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