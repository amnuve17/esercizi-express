import express from 'express';
import fs from 'fs';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({message: "Server's running"});
})

//esercizio 1
app.get("/quotes", (req, res)=>{
    try {
        const dbText = fs.readFileSync('./dbEs1.json');
        const dbJson = JSON.parse(dbText);
        const quotes = dbJson.quotes; 
        const randomIndex = Math.floor(Math.random() * quotes.length);
        res.json(quotes[randomIndex]);
    } catch (error) {
        console.log({error});
    }
})

//esercizio 2
app.get("/convert", (req, res) => {
    try {
        const km = parseFloat(req.query.km);
        if(isNaN(km)){
            return res.status(400).send("Errore: inserisci un numero per km");
        }
        const miles = kmToMiles(km);
        res.json({"kilometers": km, "miles": miles})
    } catch (error) {
        console.log(error);
    }
})

//esercizio 3
app.get("/sum", (req, res) => {
    try {
        const a = parseFloat(req.query.a);
        const b = parseFloat(req.query.b);
        if(isNaN(a) || isNaN(b)){
            return res.status(400).send("Errore: a e b devono essere numeri");
        }
        res.json({"a": a, "b": b, "result": a + b})
    } catch (error) {
        console.log(error);
    }
})

//esercizio 4
app.post("/text", (req, res) =>{
    const { text } = req.body;
    if(!text){
        return res.status(400).json({ message: "Write some text!" })
    }

    fs.writeFile('./dbEs4.json', text, (err)=>{
        if(err) {
            return res.status(500).json({message: 'File could not be written'})
        }
        res.status(200).json({message: 'Text written succesfully'})
    })
})

app.delete("/text", (req, res) => {
    fs.writeFile('./dbEs4.json', "", (err) => {
        if (err) {
            return res.status(500).json({ message: "Errore nella cancellazione del file" });
        }
        res.status(200).json({ message: "Contenuto del file cancellato con successo" });
    });
});

app.listen(PORT, () => {
    console.log(`Server's running on port ${PORT}`);
})

//functions
function kmToMiles(km){
    const conversionRate = 0.621371; // 1 km = 0.621371 miglia
    return conversionRate * km;
}