function $(ele) {
  var t = document.getElementById(ele);
  if(t == null) t = document.getElementsByName(ele);
  if(t.length == 1) t = t.item(0);
  return t;
}

function escapeHTML(str) {
  //code portion borrowed from prototype library
  var div = document.createElement('div');
  var text = document.createTextNode(str);
  div.appendChild(text);
  return div.innerHTML;
  //end portion
}

function wordwrap(str) {
  parts = str.split(" ");

  for(i = 0; i < parts.length; i++) {
    if(parts[i].length <= 30) continue;

    t = parts[i].length;
    p = "";

    for(var j = 0; j < (parts[i].length - 30); j += 30) p += parts[i].substring(j, j + 30) + "<wbr />";
    parts[i] = p + parts[i].substring(j, parts[i].length);
  }

  return parts.join(" ");
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

function parseValue(val, level) {
  elementCount++;

  if(val == null) return "<span class='void'>(null)</span>";
  if(typeof(val) == "string") return "<span class='string'>" + val.replace(/\n/g, "<br />") + "</span>";
  if(typeof(val) == "number") return "<span class='number'>" + val + "</span>";
  if(typeof(val) == "boolean") return "<span class='boolean'>" + val + "</span>";

  if(level > nestingLevel) nestingLevel = level;
  if(val instanceof Array) {
    arrayCount++;
    return parseArray(val, level);
  }

  objectCount++;
  return parseObject(val, level);
}

function parseArray(val, level) {
  if(val.length == 0) return "(empty <span>Array</span>)\n";

  var out = "<div class='wrap'>\n<div class='array'>\n<div class='widgets'>▲</div>\n<h3><span>Array</span></h3>\n";

  out += "<table class='arraytable'>\n<tr><th class='key'>Index</th><th class='value'>Value</th></tr>\n";

  for(var i = 0, len = val.length; i < len; i++) {
    out += "<tr><td>" + i + "</td><td>" + parseValue(val[i], level + 1) + "</td></tr>\n";
  }

  out += "</table>\n";

  out += "</div>\n</div>\n";
  return out;
}

function parseObject(val, level) {
  var keys = Object.keys(val);
  var len = keys.length;

  if(len == 0) return "(empty <span>Object</span>)\n";

  var out = "<div class='wrap'>\n<div class='object'>\n<div class='widgets'>▲</div>\n<h3><span>Object</span></h3>\n";

  out += "<table class='objecttable'>\n<tr><th class='key'>Name</th><th class='value'>Value</th></tr>\n";

  for(var i = 0; i < len; i++) {
    out += "<tr><td>" + keys[i] + "</td><td>" + parseValue(val[keys[i]], level + 1) + "</td></tr>\n";
  }

  out += "</table>\n";

  out += "</div>\n</div>\n";
  return out;
}


function parse(str) {
  elementCount = 0;
  arrayCount = 0;
  objectCount = 0;
  nestingLevel = 0;

  var obj = null;
  try {
    obj = JSON.parse(str);
  }
  catch(e) {
    if(e instanceof SyntaxError) {
      alert("There was a syntax error in your JSON string.\n" + e.message + "\nPlease check your syntax and try again.");
      $("text").focus();
      return;
    }

    alert("There was an unknown error. Perhaps the JSON string contained a deep level of nesting.");
    $("text").focus();
    return;
  }

  return parseValue(obj, 1);
}

function doParse() {
  $("submit").value = "processing...";
  $("submit").disabled = "disabled";

  setTimeout(doParse2, 50);
}

function doParse2() {
  var value = $("text").value;
  if(value.substr(0, 4) == "http" || value.substr(0, 4) == "file" || value.substr(0, 3) == "ftp") {
    getURL(value);
  }
  else {
    var result = parse(escapeHTML(value), null);
    if(result != null) $("output").innerHTML = result;

    $("stats").innerHTML = doStats();
    $("stats").className = "";

    $("submit").value = "json 2 html";
    $("submit").disabled = null;

    //location.href = "#_output";
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
    var result = parse(escapeHTML(http.responseText), null);
    if(result != null) $("output").innerHTML = result;

    $("stats").innerHTML = doStats();

    $("submit").value = "json 2 html";
    $("submit").disabled = null;

    location.href = "#_output";
  }
}

function showStats() {
  if($("statscon").style.display != "block") {
    $("statscon").style.display = "block";
    $("stats").className = "statson";
    $("statst").value = "Hide Statistics";
  }
  else {
    $("statscon").style.display = "none";
    $("stats").className = "";
    $("statst").value = "Show Statistics";
  }
}

function hideChild(ele) {
  var minimizing = ele.innerHTML == "▲";
  console.log(ele);

  var nodes = ele.parentNode.childNodes;
  console.log("nodes: ", nodes);
  for(i = 0; i < nodes.length; i++) {
    if(nodes[i].tagName == "TABLE") {
      nodes[i].style.display = (minimizing ? "none" : "");

      //ele.parentNode.parentNode.style.paddingRight = (minimizing ? "2.0em" : "1.5em");
      //ele.parentNode.style.right = (minimizing ? "1em" : "1.5em");
      ele.innerHTML = minimizing ? "▼" : "▲";

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
  $("desc").style.display = "block";
  bodySize = Client.viewportSize();

  $("bodywrap").style.display = "block";
  $("bodywrap").style.opacity = "0.6";

  $("desc").style.left = ((bodySize.width / 2) - ($("desc").offsetWidth / 2)) + "px";
  $("desc").style.top = ((bodySize.height / 2) - ($("desc").offsetHeight / 2)) + "px";
}

function hideHelp() {
  $("desc").style.display = "none";
  $("bodywrap").style.display = "none";
  $("text").focus();
}

function load() {
  try {
    http = new ActiveXObject("Microsoft.XMLHTTP");
  }
  catch(e) {
    try {
      http = new XMLHttpRequest();
    }
    catch(e) {
    }
  }

  document.body.addEventListener("click", function(e) {
    if(e.target && e.target.matches(".widgets")) hideChild(e.target);
  });

  bodySize = Client.viewportSize();

  if($("text").focus) $("text").focus();
}

window.onload = load;