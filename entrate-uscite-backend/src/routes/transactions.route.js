import express from 'express';
import prisma from '../prisma/prismaClient.js';

const transactionsRouter = express.Router();

transactionsRouter.get("/transactions", async (req, res) => {
    try {
        const transactions = await prisma.movements.findMany({
            orderBy: {
                date: "desc"
            }
        });

        if (transactions.length > 0) {
            res.json(transactions);
        } else {
            res.json({
                message: "Non ci sono transazioni disponibili",
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Impossibile trovare transazioni" });
    }
});

transactionsRouter.post("/transactions", async(req, res) =>{
    const { date, amount, description } = req.body;
    try {
        const newMovement = await prisma.movements.create({
            data: {
                date,
                amount,
                description
            }
        });
        res.json(newMovement);
    } catch (error) {
        res.status(500).json({message: "impossibile creare transazione"})
    }
})

transactionsRouter.delete("/transactions/:id", async (req, res) =>{
    const { id } = req.params; 
    try {
        const deleteTransaction = await prisma.movements.delete({
            where: {
                id: parseInt(id)
            }
        })
        res.json({
            message: "Transazione eliminata con successo",
            transaction: deleteTransaction
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "impossibile eliminare la transazione",
            details: error.message
        })
    }
});

transactionsRouter.put("/transactions/:id", async (req, res) => {
    const { id } = req.params;
    const { date, amount, description } = req.body
    try {
        const updatedTransaction = await prisma.movements.update({
            where:{
                id: parseInt(id)
            },
            data:{
                date,
                amount,
                description
            }
        })
        res.json(updatedTransaction)
    } catch (error) {
        console.error(error);
    }
})

transactionsRouter.get("/transactions/filter", async (req, res) => {
    const {date_min, date_max} = req.query;
    try {

        const minDate = new Date(date_min);
        const maxDate = new Date(date_max);

        const transactions = await prisma.movements.findMany({
            orderBy:{
                date: "desc"
            },
            where: {
                AND: [
                    { date: {gt: minDate} },
                    { date: {lt: maxDate} }
                ]
            }
        })

        if(transactions.length > 0){
            res.json(transactions);
        }
        else{
            res.json({message: "non ci sono transazioni nello span di tempo indicato"})
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "impossibile visualizzare le transazioni"})
    }
});

export default transactionsRouter;
