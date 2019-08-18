import { SyntaxKind, SourceFile } from 'ts-morph';
import _ from 'lodash';

function getKindNamesForApi() {
  // some SyntaxKinds are repeated, so only use the first one
  const kindNames: { [kind: number]: string } = {};
  for (const name of Object.keys(SyntaxKind).filter(k =>
    isNaN(parseInt(k, 10))
  )) {
    const value = (SyntaxKind as any)[name] as number;
    if (kindNames[value] == null) kindNames[value] = name;
  }
  return kindNames;
}
export const kindNames = getKindNamesForApi();

export const parseTag = (e: any): any => {
  const node = e._compilerNode || e;
  let kind = e.kind;
  if (!kind && e.getKind) {
    kind = e.getKind();
  }

  switch (kind) {
    case SyntaxKind.JsxText:
      if (e.containsOnlyTriviaWhiteSpaces) return undefined;
      return e.text;
    case SyntaxKind.JsxSelfClosingElement:
      return {
        tag: node.tagName.escapedText,
        props: _.map(node.attributes.properties, i => parseProp(i)),
        children: []
      };
    case SyntaxKind.JsxElement:
      return {
        tag: _.get(node, 'openingElement.tagName.escapedText'),
        props: _.map(node.openingElement.attributes.properties, i =>
          parseProp(i)
        ),
        children: _(node.children)
          .map(i => parseTag(i))
          .filter(i => !!i)
          .value()
      };
  }
};

const parseProp = (e: any) => {
  const kind = kindNames[e.initializer.expression.kind];
  const detail: any[] = [];

  if (kind === 'ObjectLiteralExpression') {
    if (e.initializer.expression.properties) {
      e.initializer.expression.properties.map((p: any) => {
        if (p.identifier) {
          detail[p.identifier.escapedText] = {
            kind: kind[p.initializer.kind],
            value: p.initializer.text
          };
        }
      });
    }
  }

  return {
    name: e.name.escapedText,
    kind,
    detail,
    text: e.initializer
      .getText()
      .trim()
      .slice(1, -1)
  };
};

export const getImport = (sf: SourceFile) => {
  const imprts = sf.getImportDeclarations();
  return _.map(imprts, i => {
    const ic = i.getImportClause();
    const ms = i.getModuleSpecifier();
    const nb = i.getNamedImports();

    return {
      default: _.get(ic, '_compilerNode.name.escapedText'),
      named: _.map(nb, n => {
        return n.getText();
      }),
      from: _.get(ms, '_compilerNode.text')
    };
  });
};

export const getDefaultComponent = (sf: any): any => {
  const expt = sf.getFirstChildByKind(SyntaxKind.ExportAssignment);
  if (expt) {
    let array: any = expt
      .getFirstChildByKindOrThrow(SyntaxKind.ArrowFunction)
      .getFirstChildByKindOrThrow(SyntaxKind.Block)
      .getFirstChildByKindOrThrow(SyntaxKind.ReturnStatement);

    try {
      array = array.getFirstChildByKindOrThrow(
        SyntaxKind.ParenthesizedExpression
      );
    } catch (e) {}

    const expr = array.getExpression();
    return {
      wrapper: [],
      props: [],
      data: [],
      effects: [],
      render: parseTag(expr)
    };
  }
  return null;
};
