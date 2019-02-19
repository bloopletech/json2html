window.transformTree = function(parseTree) {
  var tree = null;
  var treeMap = [];

  function register(treeish) {
    treeMap.push(treeish);
    treeish.index = treeMap.length - 1;
  }

  var TreeVoid = function(address) {
    this.address = address;
    this.value = "(null)";
    register(this);
  }

  Object.defineProperty(TreeVoid.prototype, "type", { value: "void" });
  Object.defineProperty(TreeVoid.prototype, "typeLabel", { value: "Void" });
  Object.defineProperty(TreeVoid.prototype, "simple", { value: true });

  var TreeString = function(address, value) {
    this.address = address;
    this.value = value.toString();
    register(this);
  }

  Object.defineProperty(TreeString.prototype, "type", { value: "string" });
  Object.defineProperty(TreeString.prototype, "typeLabel", { value: "String" });
  Object.defineProperty(TreeString.prototype, "simple", { value: true });

  var TreeNumber = function(address, value) {
    this.address = address;
    this.value = value.toString();
    register(this);
  }

  Object.defineProperty(TreeNumber.prototype, "type", { value: "number" });
  Object.defineProperty(TreeNumber.prototype, "typeLabel", { value: "Number" });
  Object.defineProperty(TreeNumber.prototype, "simple", { value: true });

  var TreeBoolean = function(address, value) {
    this.address = address;
    this.value = value.toString();
    register(this);
  }

  Object.defineProperty(TreeBoolean.prototype, "type", { value: "boolean" });
  Object.defineProperty(TreeBoolean.prototype, "typeLabel", { value: "Boolean" });
  Object.defineProperty(TreeBoolean.prototype, "simple", { value: true });

  var TreeTuple = function(name, value) {
    this.name = name;
    this.value = value;
  }

  var TreeAddress = function(parent, prop) {
    this.parent = parent;
    this.prop = prop;
  }

  TreeAddress.prototype.full = function() {
    var trail = [];
    var address = this;
    while(address) {
      trail.push(address);
      address = address.parent && address.parent.address;
    }
    return trail.reverse();
  }

  var TreeObject = function(address) {
    this.address = address;
    this.tuples = [];
    register(this);
  }

  Object.defineProperty(TreeObject.prototype, "type", { value: "object" });
  Object.defineProperty(TreeObject.prototype, "typeLabel", { value: "Object" });
  Object.defineProperty(TreeObject.prototype, "simple", { value: false });

  var TreeArray = function(address) {
    this.address = address;
    this.tuples = [];
    register(this);
  }

  Object.defineProperty(TreeArray.prototype, "type", { value: "array" });
  Object.defineProperty(TreeArray.prototype, "typeLabel", { value: "Array" });
  Object.defineProperty(TreeArray.prototype, "simple", { value: false });

  function transform(val, address) {
    var type = typeof(val);

    if(val == null) return new TreeVoid(address);
    if(type == "string") return new TreeString(address, val);
    if(type == "number") return new TreeNumber(address, val);
    if(type == "boolean") return new TreeBoolean(address, val);
    return transformObject(val, address);
  }

  function transformObject(val, address) {
    var result = (val instanceof Array) ? new TreeArray(address) : new TreeObject(address);

    result.tuples = Object.keys(val).map(function(prop) {
      return new TreeTuple(prop, transform(val[prop], new TreeAddress(result, prop)));
    });

    return result;
  }

  var root = transform(parseTree, null);
  
  var nestingLevel = 0;
  treeMap.forEach(function(item) {
    if(!item.address) return;

    var addressLength = item.address.full().length;
    if(addressLength > nestingLevel) nestingLevel = addressLength;
  });

  function fromIndex(index) {
    return treeMap[index];
  }

  return {
    root: root,
    nestingLevel: nestingLevel + 1,
    fromIndex: fromIndex
  };
};