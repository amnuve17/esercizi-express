//Istanzio la comunicazione con il db solo una volta e la richiamo quando mi serve
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;