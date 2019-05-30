exports.MONGO_DATABASE_URL = process.env.MONGO_DATABASE_URL || "mongodb://localhost/efu-localdb";
//exports.MONGO_DATABASE_URL = process.env.MONGO_DATABASE_URL || "mongodb://admin:Daisl9515@ds217360.mlab.com:17360/efu-db1";
exports.PORT = process.env.PORT || '8080';
exports.JWT_SECRET = process.env.JWT_SECRET || "Daisl";
exports.JWT_EXPIRY = process.send.JWT_EXPIRY || '7d';
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';