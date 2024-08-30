const mongoose = require('mongoose');
const { Schema } = mongoose;

const logSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  details: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String }, // Capture the user agent (browser, OS info)
  location: { type: String },
  timestamp: { type: Date, default: Date.now },
},{versionKey:false});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
