import _ from "lodash";
import { observer, useObservable } from "mobx-react-lite";
import { Label } from "office-ui-fabric-react";
import React, { useEffect } from "react";
import SplitPane from "react-split-pane";
import { Api } from "../../api/Api";
import VariableComponent, {
  detailAttrStyle
} from "./Variable/VariableComponent";

const recurseFind = (array: any[], find: string) => {
  let found = undefined;
  _.each(array, i => {
    if (i.relativePath === find) {
      found = i;
    } else if (i.children) {
      let f = recurseFind(i.children, find);
      if (f) {
        found = f;
      }
    }
  });
  return found;
};

const Message = ({ text }: any) => (
  <div style={{ textAlign: "center", padding: 100, color: "#ccc" }}>
    &mdash; {text} &mdash;
  </div>
);

export default observer(({ data }: any) => {
  const source = useObservable({
    import: [] as any,
    default: {} as any
  });
  const file: any = recurseFind(data.dir, data.selected);
  useEffect(loadStructure.bind(source, file), [file]);

  if (data.loading) {
    return <Message text="Loading components" />;
  }
  if (!data.selected) {
    return <Message text="Please select a component" />;
  }
  if (!file) {
    return <Message text="Component not found, Please refresh the tree " />;
  }
  const namesplit = file.name.split(".");
  namesplit.pop();
  const name = namesplit.join(".");

  return (
    <SplitPane minSize={400}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div
          style={{
            padding: "6px 0px 5px 15px",
            borderBottom: "1px solid #ccc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Label> {name || "_"} </Label>
          <Label style={detailAttrStyle}>{source.import.length} Imports</Label>
        </div>
        <SplitPane
          split="horizontal"
          minSize={91}
          primary="second"
          style={{ position: "relative", height: "100%" }}
        >
          <VariableComponent type="const" />
          <div />
        </SplitPane>
      </div>
      <div />
    </SplitPane>
  );
});

const loadStructure = function(this: any, file: any) {
  const fetch = async () => {
    if (file) {
      let source = await Api.source(file.relativePath);
      this.default = source.default;
      this.import = source.import;
    }
  };
  fetch();
};
