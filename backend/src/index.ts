import cors from "cors";
import express from "express";
import path from "path";
import { Project, SyntaxKind, VariableDeclarationKind } from "ts-morph";

export let rootPath = "../app/src/";
export let absPath = path.resolve(rootPath);
export const app = express();
export const port = 4000;
export const project = new Project({
  tsConfigFilePath: rootPath + "../tsconfig.json"
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

require('./routes/export.ts');
require('./routes/filetree.ts');
require('./routes/function.ts');
require('./routes/import.ts');
require('./routes/project.ts');
require('./routes/source.ts');
require('./routes/var.ts');
require('./routes/statement.ts');

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

