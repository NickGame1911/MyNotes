const express = require('express') 
const bodyParser = require('body-parser')
const app = express() 
const fs = require('fs')

app.set('view engine', 'ejs')

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ 
	extended: true
}))

const fileNotes = fs.readFileSync('notes.txt', 'utf8').split('\n'); // Чтение всех заметок из файла
var NOTE_ID = 0;        // Счетчик для ID всех заметок
var arrId = []          // Массив ID
var arrContent = []     // Массив содержания
var notes = []          // Массив заметок

// Цикл отделения ID и содержания для каждой заметки
fileNotes.forEach(note => {  
    if (note.slice(0,"noteId: ".length) == "noteId: ") { 
        arrId.push(Number(note.slice("noteId: ".length)));
    }
    else if (note.slice(0,"noteContent: ".length) == "noteContent: ") { 
        arrContent.push(note.slice("noteContent: ".length));
    }
    else if (note != '') arrContent[arrContent.length - 1] += note;
})

// Цикл создания массива заметок на основе прочитанных данных из файла
for (let i = 0; i < arrId.length; i++) {
    notes.push({noteId: arrId[i], noteContent: arrContent[i]});
    
    // Установка глобального счетчика ID для следующих заметок
    if (i == arrId.length - 1) NOTE_ID = arrId[i];
}

// Функция вывода данных
app.get("/", function (req, res) { 
	res.render("home", { 
		data: notes 
	}) 
}) 

// Функция создания новой заметки
app.post("/", (req, res) => { 
	const noteContent = req.body.noteContent 
	const noteId = NOTE_ID + 1;
    NOTE_ID += 1;

	notes.push({ 
		noteId: noteId, 
		noteContent: noteContent 
	}) 

	res.render("home", { 
		data: notes 
	}) 
})

// Функция сохранения всех заметок
app.post('/save', (req, res) => { 
    fs.truncateSync('notes.txt');
    
	notes.forEach(note => { 
		str = "noteId: " + note.noteId + '\n' + "noteContent: " + note.noteContent + '\n';
        fs.appendFileSync('notes.txt', str + '\n');
	})

	res.render("home", { 
		data: notes 
	}) 
})

// Функция обновления заметки
app.post('/update', (req, res) => { 
	var noteId = req.body.noteId; 
	var noteContent = req.body.noteContent; 
	
	notes.forEach(note => { 
		if (note.noteId == noteId) { 
			note.noteContent = noteContent;
		} 
	})
    
	res.render("home", { 
		data: notes 
	}) 
}) 

// Функция удаления заметки
app.post('/delete', (req, res) => { 
	var noteId = req.body.noteId; 
	var index = 0;
    
	notes.forEach(note => {  
		if (note.noteId == noteId) { 
			notes.splice((index), 1) 
		}
        index += 1;
	}) 

	res.render("home", { 
		data: notes 
	}) 
}) 

app.listen(3000, (req, res) => { 
	console.log("Server started: http://localhost:3000") 
})