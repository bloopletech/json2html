"use strict";

window.gatherStatistics = function(root) {
  var elementCount = 0;
  var arrayCount = 0;
  var objectCount = 0;

  function visit(node) {
    elementCount++;
    if(node.simple) return;

    if(node.type == "array") arrayCount++;
    else if(node.type == "object") objectCount++;

    node.tuples.forEach(function(tuple) {
      visit(tuple.value);
    });
  }

  visit(root);

  return {
    elementCount: elementCount,
    arrayCount: arrayCount,
    objectCount: objectCount
  };
};
