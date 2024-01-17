import {Router} from "express";
import {TestingRepository} from "../repositories/testing-repository";

export const testingRoute = Router();

testingRoute.delete("/all-data", async (req, res) => {
    await TestingRepository.deleteAllData();
    res.sendStatus(204);
})
