import { app, absPath, project } from "../index";
import jetpack from "fs-jetpack";
import fs from "fs";

app.post("/new-file", (req: any, res: any) => {
  const path = req.body.path.replace("./", absPath + "/");
  const sf = project.createSourceFile(
    path,
    `
  import React from "react";
  import { View } from "react-xp";
  
  export default () => {
    return (<View/>);
  };
  `
  );
  sf.saveSync();
  project.saveSync();
  res.send("ok");
});

app.post("/new-dir", (req: any, res: any) => {
  const path = req.body.path.replace("./", absPath + "/");
  const sf = project.createDirectory(path);
  if (sf) {
    sf.saveSync();
    project.saveSync();
    res.send("ok");
  }
});

app.post("/move", (req: any, res: any) => {
  const from = req.body.from.replace("./", absPath + "/");
  const to = req.body.to.replace("./", absPath + "/");
  if (fs.lstatSync(from).isDirectory()) {
    const sf = project.getDirectory(from);
    if (sf) {
      sf.moveImmediatelySync(to);
      project.saveSync();
      res.send("ok");
    }
  } else {
    const sf = project.getSourceFile(from);
    if (sf) {
      sf.moveImmediatelySync(to);
      project.saveSync();
      res.send("ok");
    }
  }
});

app.post("/del", (req: any, res: any) => {
  const path = req.body.path.replace("./", absPath + "/");
  if (fs.lstatSync(path).isDirectory()) {
    const sf = project.getDirectory(path);
    if (sf) {
      sf.forget();
      project.save();
      jetpack.remove(path);
      res.send("ok");
    }
  } else {
    const sf = project.getSourceFile(path);
    if (sf) {
      sf.delete();
      project.save();
      res.send("ok");
    }
  }
});
