//takes a json object, returns the number of 
// pairs in it
function getSize(obj) {
    var size = 0,
        key;
    for (key in obj) size++;
    return size;
};

module.exports.getSize = getSize;