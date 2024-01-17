import {app} from "./settings";
import {blogRoute} from "./routes/blog-route";
import {postRoute} from "./routes/posts-route";
import express from "express";
import {connectDB} from "./db/db";


const PORT = 80;

app.listen(PORT, async () => {
    await connectDB();
});
