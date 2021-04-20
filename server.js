const express = require('express');
const app = express();
const PORT = 1337;

const cors = require('cors')

app.use(cors());

app.use(express.json());

app.post('/', (req, res) => {
	res.send('Hej på dig di!');
});

app.listen(PORT, () => {
	console.log('Server is listening to port ' + PORT);
});