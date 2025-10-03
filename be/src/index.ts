import express from "express";
import cors from "cors";
import router from "./router";
import { initialSettings, connectMongoDB } from "./config";

connectMongoDB();

const { creatorFeeAmount, marketCount, decimal, fundFeePercentage, bettingFeePercentage } = initialSettings;
const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Router
app.use('/api/v1', router);

app.get('/', (req, res) => {
    res.send("Welcome to Prediction market server!");
})

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})