const express = require('express');
const app = express();
const PORT = 1337;
const hamsters = require('./routes/hamsters.js');
const path = require('path');
const cors = require('cors');

//middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
	console.log(req.method);
	next();
});

app.use('/hamsters', hamsters);


app.listen(PORT, () => {
	console.log('Server is listening to port ' + PORT);
});