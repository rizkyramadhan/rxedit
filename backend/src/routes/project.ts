import { app, absPath } from "../index";
import jetpack from "fs-jetpack";

app.post("/loadproject", (req: any, res: any) => {
  res.send("ok");
});
app.post("/newproject", (req: any, res: any) => {});
app.post("/check", (req: any, res: any) => {});
app.get("/list", (req: any, res: any) => {
  const tree = jetpack.inspectTree(absPath, {
    relativePath: true
  });
  res.send(JSON.stringify(tree));
});
