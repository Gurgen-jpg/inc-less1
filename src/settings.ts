import express from "express";
import {blogRoute} from "./routes/blog-route";
import {postRoute} from "./routes/posts-route";
import {testingRoute} from "./routes/testing-route";
import {authRoute} from "./routes/auth-route";
import {usersRoute} from "./routes/users-route";
import {commentsRoute} from "./routes/comments-route";
import cookieParser from "cookie-parser";
import {securityRoute} from "./routes/security-route";

export const app = express();

app.set('trust proxy', true);

app.use(express.json());
app.use(cookieParser());

app.use('/blogs', blogRoute);
app.use('/posts', postRoute);
app.use('/testing', testingRoute);
app.use('/auth', authRoute);
app.use('/users', usersRoute);
app.use('/comments', commentsRoute);
app.use('/security', securityRoute);
