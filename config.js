exports.MONGO_DATABASE_URL = process.env.MONGO_DATABASE_URL || "mongodb://localhost/efu-localdb";
exports.PORT = process.env.PORT || '8080';
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.send.JWT_EXPIRY || '7d';