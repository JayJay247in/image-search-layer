// models/SearchTerm.js
const mongoose = require('mongoose');

const searchTermSchema = new mongoose.Schema({
  term: {
    type: String,
    required: true
  },
  when: {
    type: Date,
    default: Date.now
  }
});

// Create a TTL index to automatically delete documents after a certain time (e.g., 7 days)
// This keeps the "recent searches" collection from growing indefinitely. Optional.
// searchTermSchema.index({ when: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });


module.exports = mongoose.model('SearchTerm', searchTermSchema);