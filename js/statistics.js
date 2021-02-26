"use strict";

window.renderStatistics = function(text) {
  function gather(root) {
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

  function render(text) {
    const textByteLength = Util.byteLength(text);
    const result = gather(window.tree.root);
    return `
      <div id='stats'>
        <h3>Statistics</h3>
        <table>
          <tr>
            <td>Number of Arrays:</td>
            <td>${Util.format(result.arrayCount)}</td>
          </tr>
          <tr>
            <td>Number of Objects:</td>
            <td>${Util.format(result.objectCount)}</td>
          </tr>
          <tr>
            <td>Total number of all elements:</td>
            <td>${Util.format(result.elementCount)}</td>
          </tr>
          <tr>
            <td>Nesting depth:</td>
            <td>${Util.format(window.tree.nestingLevel)}</td>
          </tr>
          <tr>
            <td>Size of JSON document (UTF-8 bytes):</td>
            <td>${Util.humanFileSize(textByteLength)} (${Util.format(textByteLength)} B)</td>
          </tr>
          <tr>
            <td>Size of JSON document (UTF-16 code units):</td>
            <td>${Util.humanFileSize(text.length)} (${Util.format(text.length)} B)</td>
          </tr>
        </table>
      </div>
    `;
  }

  return render(text);
};
