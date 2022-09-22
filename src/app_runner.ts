import app from "./app";
import * as mongoose from "mongoose";
import {ConnectOptions} from "mongoose";

// connect to mongodb
mongoose.connect("mongodb://localhost:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as ConnectOptions, (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    } else {
        console.log("Connected to mongodb");
        app.listen(3000, function () {
            console.log('App is listening on port 3000!');
        });
    }
});




