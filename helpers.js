function getSize(obj) {
    var size = 0,
        key;
    for (key in obj) size++;
    return size;
};

module.exports.getSize = getSize;