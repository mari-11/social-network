const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

const mongoose = require('mongoose');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("./routes"));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/social-net', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log('Now listening on port 3001');
});