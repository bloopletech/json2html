"use strict";

window.gatherStatistics = function(root) {
  let elementCount = 0;
  let arrayCount = 0;
  let objectCount = 0;

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
