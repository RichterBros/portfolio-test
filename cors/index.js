const cors = require("cors");
const corsOptions = {
  origin: "https://eloquent-boyd-bd99b4.netlify.app",
  optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);
