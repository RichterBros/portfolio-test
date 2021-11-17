const cors = require("cors");
const corsOptions = {
  // origin: "https://eloquent-boyd-bd99b4.netlify.app",
  origin: "http://richterbrosmedia.com",
  optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);
