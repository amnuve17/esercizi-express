import express from "express";
import transactionsRouter from "./routes/transactions.route.js";

const PORT = process.env.PORT || 3000;

const app = express();
// Middleware per il parsing del JSON
app.use(express.json());

// Route di test
app.get("/", (req, res) => {
  res.json({ message: "Server funzionante!" });
});

app.use(transactionsRouter);

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
});
