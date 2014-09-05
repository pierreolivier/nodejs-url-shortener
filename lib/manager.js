database = null;

exports.setDatabase = function(instance) {
    database = instance;
};
exports.getDatabase = function() {
    return database;
};