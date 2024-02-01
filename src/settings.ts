import express, {Request, Response} from "express";
import {blogRoute} from "./routes/blog-route";
import {postRoute} from "./routes/posts-route";
import {testingRoute} from "./routes/testing-route";
import {authRoute} from "./routes/auth-route";

export const app = express();
app.use(express.json());

app.use('/blogs', blogRoute);
app.use('/posts', postRoute);
app.use('/testing', testingRoute);
app.use('/auth', authRoute);
