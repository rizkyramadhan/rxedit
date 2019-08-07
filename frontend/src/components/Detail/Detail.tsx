import _ from "lodash";
import { observer, useObservable } from "mobx-react-lite";
import { IconButton, Label } from "office-ui-fabric-react";
import React, { useEffect, useState } from "react";
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
    default: {} as any,
    variable: [] as any
  });
  const setVariable = (value: any) => {
    source.variable = value;
  };
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
            alignItems: "center",
            flexGrow: 1
          }}
        >
          <Label
            style={{
              justifyContent: "flex-start",
              display: "flex",
              flexGrow: 1
            }}
          >
            {" "}
            {name || "_"}{" "}
          </Label>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Label
              style={detailAttrStyle}
              onClick={() => console.log(source.variable)}
            >
              {source.import.length} Imports
            </Label>
            <IconButton
              iconProps={{ iconName: "CircleAddition" }}
              title="Add Variable"
              ariaLabel="Add Variable"
              styles={{
                root: {
                  height: 27
                }
              }}
              onClick={() => {
                let items = source.variable;
                items.push({
                  name: "string",
                  type: "const",
                  dataType: "string",
                  value: null as any
                });
                setVariable(items);
              }}
            />
          </div>
        </div>
        <SplitPane
          split="horizontal"
          minSize={91}
          primary="second"
          style={{ position: "relative", height: "100%" }}
          paneStyle={{
            overflowY: "auto"
          }}
        >
          <div>
            {source.variable.map((item: any, idx: number) => {
              return (
                <VariableComponent
                  key={idx}
                  index={idx}
                  data={item}
                  props={source.variable}
                  setProps={setVariable}
                />
              );
            })}
          </div>
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
