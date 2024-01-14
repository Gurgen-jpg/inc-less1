import {app} from "./settings";
import {blogRoute} from "./routes/blog-route";
import {postRoute} from "./routes/posts-route";
import express from "express";


const PORT = 80;

app.listen(PORT, () => console.log(`Here you go. ${PORT}`));
