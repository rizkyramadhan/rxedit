import * as cors from 'cors';
import * as express from 'express';
import * as fs from 'fs';
import * as jetpack from 'fs-jetpack';
import * as path from 'path';
import { Project, SourceFile } from 'ts-morph';
import { getDefaultComponent, getImport } from './parser';

let rootPath = '../app/src/';
let absPath = path.resolve(rootPath);
const app = express();
const port = 4000;
let project = new Project({
  tsConfigFilePath: rootPath + '../tsconfig.json'
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.post('/loadproject', (req, res) => {
  // if (req.body.path) {
  //   rootPath = req.body.path;
  //   absPath = path.resolve(rootPath);
  // }
  res.send('ok');
});
app.post('/newproject', (req, res) => {});
app.post('/check', (req, res) => {});
app.get('/list', (req, res) => {
  const tree = jetpack.inspectTree(absPath, {
    relativePath: true
  });
  res.send(JSON.stringify(tree));
});
app.post('/source', (req, res) => {
  const path = req.body.path.replace('./', absPath + '/');
  const sf = project.getSourceFile(path);
  if (sf) {
    res.send(
      JSON.stringify({
        import: getImport(sf),
        default: getDefaultComponent(sf)
      })
    );
  }
});
app.post('/new-file', (req, res) => {
  const path = req.body.path.replace('./', absPath + '/');
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
  res.send('ok');
});
app.post('/new-dir', (req, res) => {
  const path = req.body.path.replace('./', absPath + '/');
  const sf = project.createDirectory(path);
  if (sf) {
    sf.saveSync();
    project.saveSync();
    res.send('ok');
  }
});
app.post('/move', (req, res) => {
  const from = req.body.from.replace('./', absPath + '/');
  const to = req.body.to.replace('./', absPath + '/');
  if (fs.lstatSync(from).isDirectory()) {
    const sf = project.getDirectory(from);
    if (sf) {
      sf.moveImmediatelySync(to);
      project.saveSync();
      res.send('ok');
    }
  } else {
    const sf = project.getSourceFile(from);
    if (sf) {
      sf.moveImmediatelySync(to);
      project.saveSync();
      res.send('ok');
    }
  }
});
app.post('/del', (req, res) => {
  const path = req.body.path.replace('./', absPath + '/');
  if (fs.lstatSync(path).isDirectory()) {
    const sf = project.getDirectory(path);
    if (sf) {
      sf.forget();
      project.save();
      jetpack.remove(path);
      res.send('ok');
    }
  } else {
    const sf = project.getSourceFile(path);
    if (sf) {
      sf.delete();
      project.save();
      res.send('ok');
    }
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
