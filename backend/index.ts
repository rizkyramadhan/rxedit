import * as jetpack from "fs-jetpack";
import * as express from "express";
import * as _ from "lodash";
import { Project } from "ts-morph";

const app = express()
const port = 3000

app.get('/', (req, res) => {
    const list = _.filter(jetpack.list("./libs/ui/"), i => i.endsWith(".tsx"));
    res.send(JSON.stringify(list, null, 2));
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})