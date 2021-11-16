const cors = require("cors");
const corsOptions = {
  // origin: "https://eloquent-boyd-bd99b4.netlify.app",
  origin: "https://unruffled-lovelace-fa8870.netlify.app",
  optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);
