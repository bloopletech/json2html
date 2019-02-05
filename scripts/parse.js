function escapeHTML(unsafe) {
  if(unsafe == null) return "";
  return unsafe.toString()
   .replace(/&/g, "&amp;")
   .replace(/</g, "&lt;")
   .replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;")
   .replace(/'/g, "&#039;");
}

var elementCount = 0;
var arrayCount = 0;
var objectCount = 0;
var nestingLevel = 0;

function doStats() {
  var out = "<input type='button' id='statst' onclick='showStats();' value='Show Statistics' style='float: right;' />\n"
   + "<div class='clear'></div>\n"
    + "<div id='statscon'>\n<table>\n<tr>\n<td>Number of Arrays:</td>\n<td>" + arrayCount + "</td>\n</tr>\n"
    + "<tr>\n<td>Number of Objects:</td>\n<td>" + objectCount + "</td>\n</tr>\n"
     + "<tr>\n<td>Total number of all elements:</td>\n<td>" + elementCount + "</td>\n</tr>\n"
      + "<tr>\n<td>Nesting depth:</td>\n<td>" + nestingLevel + "</td>\n</tr>\n"
      + "</table>\n</div>\n</div>\n";
  return out;
}

function parseValue(val, parent, level) {
  elementCount++;
  if(parent == null) parent = "";
  if(level == null) level = 1;

  if(typeof(val) == "object") {
    if(level > nestingLevel) nestingLevel = level;
    if(val instanceof Array) return parseArray(val, parent, level);
    return parseObject(val, parent, level);
  }
  else {
    if(typeof(val) == "string") return "<span class='string'>" + escapeHTML(val).replace(/\n/g, "<br>") + "</span>";
    else if(typeof(val) == "number") return "<span class='number'>" + val + "</span>";
    else if(typeof(val) == "boolean") return "<span class='boolean'>" + val + "</span>";
    else return "<span class='void'>(null)</span>";
  }
}

function parseArray(val, parent, level) {
  arrayCount++;
  parent = parent + (parent != "" ? " > " : "") + "Array (" + val.length + " item" + (val.length != 1 ? "s)" : ")");

  var out = "<div class='array' onmouseover='doFocus(event, this);'>\n<div class='widgets'><img src='images/min.gif' onclick='hideChild(this);' /></div>\n<h3><span class='titled' title='" + parent + "'>Array</span></h3>\n";

  if(val.length > 0) {
    out += "<table>\n<tr><th>Index</th><th>Value</th></tr>\n";

    for(prop in val) {
      if(typeof(val[prop]) == "function") continue;
      out += "<tr><td>" + escapeHTML(prop) + "</td><td>" + parseValue(val[prop], parent, level + 1) + "</td></tr>\n";
    }

    out += "</table>\n";
  }
  else {
    return "(empty <span class='titled' title='" + parent + "'>Array</span>)\n";
  }

  out += "</div>\n";
  return out;
}

function parseObject(val, parent, level) {
  objectCount++;
  i = 0;
  for(prop in val) {
    if(typeof(val[prop]) != "function") i++;
  }

  parent = parent + (parent != "" ? " > " : "") + "Object (" + i + " item" + (i != 1 ? "s)" : ")");

  var out = "<div class='object' onmouseover='doFocus(event, this);'>\n<div class='widgets'><img src='images/min.gif' onclick='hideChild(this);' /></div>\n<h3><span class='titled' title='" + parent + "'>Object</span></h3>\n";

  if(i > 0) {
    out += "<table>\n<tr><th>Name</th><th>Value</th></tr>\n";
    for(prop in val) {
      if(typeof(val[prop]) == "function") continue;
      out += "<tr><td>" + escapeHTML(prop) + "</td><td>" + parseValue(val[prop], parent, level + 1) + "</td></tr>\n";
    }

    out += "</table><div class='clear'></div>\n";
  }
  else {
    return "(empty <span class='titled' title='" + parent + "'>Object</span>)\n";
  }

  out += "</div>\n";
  return out;
}

function parse(str) {
  elementCount = 0;
  arrayCount = 0;
  objectCount = 0;

  var obj = null;
  try {
    obj = JSON.parse(str);
  }
  catch(e) {
    if(e instanceof SyntaxError) {
      alert("There was a syntax error in your JSON string.\n" + e.message + "\nPlease check your syntax and try again.");
      $("#text").focus();
      return;
    }

    alert("There was an unknown error. Perhaps the JSON string contained a deep level of nesting.");
    $("#text").focus();
    return
  }

  return parseValue(obj, null, null);
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
    var result = parse(value, null);
    if(result != null) $("#output").innerHTML = result;

    $("#stats").innerHTML = doStats();
    $("#stats").className = "";

    doTooltips();

    $("#submit").value = "json 2 html";
    $("#submit").disabled = null;

    location.href = "#_output";
  }
}

var http = null;

function getURL(str) {
  http.open("get", "get.php?url=" + str);
  http.onreadystatechange = gotURL;
  http.send(null);
}

function gotURL() {
  if(http.readyState == 4) {
    var result = parse(http.responseText, null);
    if(result != null) $("#output").innerHTML = result;

    $("stats").innerHTML = doStats();

    doTooltips();

    $("submit").value = "json 2 html";
    $("submit").disabled = null;

    location.href = "#_output";
  }
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

function hideChild(ele) {
  var src = ele.src + "";
  var minimizing = (src.indexOf("min.gif") != -1);

  var nodes = ele.parentNode.parentNode.childNodes;
  for(i = 0; i < nodes.length; i++) {
    if(nodes[i].tagName == "TABLE") {
      nodes[i].style.display = (minimizing ? "none" : "");

      ele.parentNode.parentNode.style.paddingRight = (minimizing ? "2.0em" : "1.5em");
      ele.parentNode.style.right = (minimizing ? "1em" : "1.5em");

      ele.src = (minimizing ? "images/max.gif" : "images/min.gif");

      return;
    }
  }
}

var currentlyFocused = null;
function doFocus(event, ele) {
  if(currentlyFocused != null) currentlyFocused.style.border = "1px solid #000000";
  ele.style.border = "1px solid #ffa000";

  currentlyFocused = ele;

  if(!event) event = window.event;
  event.cancelBubble = true;
  if(event.stopPropagation) event.stopPropagation();
}

function stopFocus() {
  if(currentlyFocused != null) currentlyFocused.style.border = "1px solid #000000";
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
  bodySize = Client.viewportSize();

  $("#backdrop").style.display = "block";

  $("#help-content").style.left = ((bodySize.width / 2) - ($("#help-content").offsetWidth / 2)) + "px";
  $("#help-content").style.top = ((bodySize.height / 2) - ($("#help-content").offsetHeight / 2)) + "px";
  location.href = "#_top";
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

function load() {
  window.$ = document.querySelector.bind(document);

  enableTooltips();

  try {
    http = new ActiveXObject("Microsoft.XMLHTTP");
  }
  catch(e) {
    try {
      http = new XMLHttpRequest();
    }
    catch(e) {}
  }

  bodySize = Client.viewportSize();

  if($("#text").focus) $("#text").focus();
}

window.onload = load;