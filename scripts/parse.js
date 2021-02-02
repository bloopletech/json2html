"use strict";

function escapeHTML(unsafe) {
  if(unsafe == null) return "";
  return unsafe.toString()
   .replace(/&/g, "&amp;")
   .replace(/</g, "&lt;")
   .replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;")
   .replace(/'/g, "&#039;");
}

var renderCount = 0;
var elementCount = 0;
var arrayCount = 0;
var objectCount = 0;
var tree = null;

function doStats() {
  var out = "<input type='button' id='statst' onclick='showStats();' value='Show Statistics' style='float: right;' />\n"
   + "<div class='clear'></div>\n"
    + "<div id='statscon'>\n<table>\n<tr>\n<td>Number of Arrays:</td>\n<td>" + arrayCount + "</td>\n</tr>\n"
    + "<tr>\n<td>Number of Objects:</td>\n<td>" + objectCount + "</td>\n</tr>\n"
     + "<tr>\n<td>Total number of all elements:</td>\n<td>" + elementCount + "</td>\n</tr>\n"
      + "<tr>\n<td>Nesting depth:</td>\n<td>" + tree.nestingLevel + "</td>\n</tr>\n"
      + "</table>\n</div>\n</div>\n";
  return out;
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

    $("#text").focus();
    return;
  }
}


function render(val) {
  elementCount = 0;
  arrayCount = 0;
  objectCount = 0;
  renderCount = 0;

  if(val.type == "array") return renderArray(val);
  if(val.type == "object") return renderObject(val);
  elementCount++;
  return "<span class='" + val.type + "' title='" + value.typeLabel + "'>" + escapeHTML(val.value) + "</span>";
}

function renderTuples(tuples) {
  var out = "";

  tuples.forEach(function(tuple) {
    var value = tuple.value;
    out += "<tr data-index='" + value.index + "'><td>" + escapeHTML(tuple.name) + "</td>";
    out += "<td class='" + value.type + "'" + (value.simple ? " title='" + value.typeLabel + "'" : "") + ">";

    if(value.simple) {
      elementCount++;
      out += escapeHTML(value.value);
    }
    else if(value.type == "array") {
      out += renderArray(value);
    }
    else if(value.type == "object") {
      out += renderObject(value);
    }
    out += "</td></tr>";
  });

  return out;
}

function renderArray(array) {
  elementCount++;
  arrayCount++;
  renderCount++;
  if(!array.tuples.length) return "<div data-index='" + array.index + "'>(empty Array)</div>";

  var out = "<div class='array" + (renderCount >= 1000 ? " minimised" : "") + "' data-index='" + array.index + "'><div class='widget'></div><h3>Array</h3>";
  out += "<table><tr><th>Index</th><th>Value</th></tr>";
  out += renderTuples(array.tuples);
  out += "</table></div>";
  return out;
}

function renderObject(object) {
  elementCount++;
  objectCount++;
  renderCount++;
  if(!object.tuples.length) return "<div data-index='" + object.index + "'>(empty Object)</div>";

  var out = "<div class='object" + (renderCount >= 1000 ? " minimised" : "") + "' data-index='" + object.index + "'><div class='widget'></div><h3>Object</h3>";
  out += "<table><tr><th>Name</th><th>Value</th></tr>";
  out += renderTuples(object.tuples);
  out += "</table></div>";
  return out;
}

function json2html(str) {
  var parseTree = parse(str);
  if(!parseTree) return;
  tree = transformTree(parseTree);
  var result = render(tree.root);

  $("#output").innerHTML = result;

  $("#stats").innerHTML = doStats();
  $("#stats").className = "";

  $("#submit").value = "json 2 html";
  $("#submit").disabled = null;

  $("#output").scrollIntoView();
}

function doParse() {
  $("#submit").value = "processing...";
  $("#submit").disabled = "disabled";

  setTimeout(doParse2, 50);
}

function doParse2() {
  var value = $("#text").value;
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

function showStats() {
  if($("#statscon").style.display != "block") {
    $("#statscon").style.display = "block";
    $("#stats").className = "statson";
    $("#statst").value = "Hide Statistics";
  }
  else {
    $("#statscon").style.display = "none";
    $("#stats").className = "";
    $("#statst").value = "Show Statistics";
  }
}

//code from Painfully Obvious.
//based on code from quirksmode.org
var Client = {
  viewportWidth: function() {
  return self.innerWidth || (document.documentElement.clientWidth || document.body.clientWidth);
  },

  viewportHeight: function() {
   return self.innerHeight || (document.documentElement.clientHeight || document.body.clientHeight);
  },

  viewportSize: function() {
   return { width: this.viewportWidth(), height: this.viewportHeight() };
  }
};

function doHelp() {
  $("#help-content").style.display = "block";
  var bodySize = Client.viewportSize();

  $("#backdrop").style.display = "block";

  $("#help-content").style.left = ((bodySize.width / 2) - ($("#help-content").offsetWidth / 2)) + "px";
  $("#help-content").style.top = ((bodySize.height / 2) - ($("#help-content").offsetHeight / 2)) + "px";
  $("body").scrollIntoView();
}

function hideHelp() {
  $("#help-content").style.display = "none";
  $("#backdrop").style.display = "none";
  $("#text").focus();
}

function clearPage() {
  $("#stats").innerHTML = "";
  $("#output").innerHTML = "";
}

function init() {
  window.$ = document.querySelector.bind(document);

  if($("#text").focus) $("#text").focus();
}

document.addEventListener("DOMContentLoaded", init);