"use strict";

var tree = null;
var result = null;

function doStats() {
  var out = "<input type='button' id='statst' onclick='showStats();' value='Show Statistics' style='float: right;' />\n"
   + "<div class='clear'></div>\n"
    + "<div id='statscon'>\n<table>\n<tr>\n<td>Number of Arrays:</td>\n<td>" + result.arrayCount + "</td>\n</tr>\n"
    + "<tr>\n<td>Number of Objects:</td>\n<td>" + result.objectCount + "</td>\n</tr>\n"
     + "<tr>\n<td>Total number of all elements:</td>\n<td>" + result.elementCount + "</td>\n</tr>\n"
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

function json2html(str) {
  var parseTree = parse(str);
  if(!parseTree) return;
  tree = transformTree(parseTree);
  result = render(tree.root);

  $("#output").innerHTML = result.output;

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