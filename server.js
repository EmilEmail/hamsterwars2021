const express = require('express');
const app = express();
const PORT = 1337;
const hamsters = require('./routes/hamsters.js');
const path = require('path');
const cors = require('cors');

//Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
	console.log(req.method, req.url);
	next();
});

//Static folders
app.use('/img', express.static(path.join(__dirname, 'img')));


//Routes
app.use('/hamsters', hamsters);


//Start server
app.listen(PORT, () => {
	console.log('Server is listening to port ' + PORT);
});