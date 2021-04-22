const express = require('express');
const app = express();
const PORT = 1337;
const hamsters = require('./routes/hamsters.js');
const matches = require('./routes/matches.js');
const matchWinners = require('./routes/matchwinners.js');
const winners = require('./routes/winners.js');
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
app.use('/matches', matches);
app.use('/matchwinners', matchWinners);
app.use('/winners', winners);


//Start server
app.listen(PORT, () => {
	console.log('Server is listening to port ' + PORT);
});