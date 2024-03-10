import {app} from "./settings";
import {connectDB} from "./db/db";



const PORT = 80;

app.listen(PORT, async () => {
    await connectDB();
});
