const express = require('express');
const cors = require('cors');

let notes = [
	{
		content: "HTML is easy",
		important: false,
		id: 1
	},
	{
		id: 2,
		content: "Browser can execute only JavaScript",
		important: false
	},
	{
		id: 3,
		content: "GET and POST are the most important methods of HTTP protocol",
		important: true
	},
	{
		content: "this is a server test",
		important: false,
		id: 4
	},
	{
		content: "this is another test",
		important: true,
		id: 5
	}
]

const app = express();

app.use(cors());
app.use(express.json());

const requestLogger = (req,rsp,next) => {
	console.log("Method:",req.method);
	console.log("Path:",req.path);
	console.log("Body:",req.body);
	console.log('---');
	next();
}

//this is a nothing change

app.use(requestLogger);

app.get('/', (request, response) => {
	response.send('<h1>Hello express<h1>');
})

app.get('/api/notes', (request, response) => {
	response.json(notes);
})

app.get('/api/notes/:id', (request, response) => {
	// console.log(request.params.id);
	const id = Number(request.params.id);
	// console.log(id);
	const note = notes.find(n => n.id === id);
	// console.log(note);
	if (note) {
		response.json(note);
	} else {
		response.status(404).end();
	}
})

app.delete("/api/notes/:id", (request, response) => {
	const id = Number(request.params.id);
	notes = notes.filter(n => n.id !== id);

	response.status(204).end();
})

app.post("/api/notes", (request, response) => {
	const body = request.body;
	if (!body.content) {
		return response.status(400)
			.json({
				error: "missing content"
			})
	}

	const note = {
		content:body.content,
		important:body.important || false,
		id:generateID()
	}

	notes = notes.concat(note);

	response.json(body);
})

const generateID = () => {
	const maxID = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0;

	return maxID + 1;
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});