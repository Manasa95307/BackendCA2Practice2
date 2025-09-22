const express = require ('express')
const fs = require ('fs')

const app = express()
const PORT = 3001;

app.use(express.json());
app.use(express.static('./frontend'))

const FILE = "entries.json";

function readEntries(){
    if (!fs.existsSync(FILE)){
        fs.writeFileSync(FILE, "[]");
    }
    const data = fs.readFileSync(FILE, "utf-8");
    return JSON.parse(data);
}

function writeEntries(entries){
    fs.writeFileSync(FILE, JSON.stringify(entries, null, 2));
}

app.get("/api/entries", (req, res)=>{
    const entries = readEntries();
    res.json(entries);
})


app.post("/api/entries", (req, res)=>{
    const { name, message } = req.body;
    if (!name || !message){
        return res.status(400).json({error:"Name and message are required"})
    }
    const entries = readEntries();
    const newEntry = {
        id: Date.now().toString(),
        name, 
        message,
    };
    entries.push(newEntry);
    writeEntries(entries);

    res.json(newEntry);
})

app.delete("/api/entries/:id", (req, res)=>{
    const id = req.params.id;
    let entries = readEntries();

    const index = entries.findIndex(entry => entry.id === id);
    if (index === -1){
        return res.status(404).json({error: "Entry not found"})
    }
    entries.splice(index, 1);
    writeEntries(entries);

    res.json({success: true});
})
app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})