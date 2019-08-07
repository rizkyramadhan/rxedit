import { observer, useObservable } from "mobx-react-lite";
import { Label } from "office-ui-fabric-react";
import React, { useEffect } from "react";
import VariableComponent from "../VariableComponent";

export default observer(({ props, setProps }: any) => {
  const source = useObservable({
    items: props.value || ([] as any)
  });
  const setVariable = (value: any) => {
    let item = { ...props };
    source.items = [...value];
    item.value = source.items;
    setProps(item);
  };

  useEffect(() => {
    let value =
      !!props.value && typeof props.value === "object" ? props.value : [];
    setVariable(value);
  }, [props]);
  return (
    <div>
      {source.items.map((item: any, idx: number) => {
        console.log(item);
        return (
          <div
            key={idx}
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "row",
              paddingBottom: 5
            }}
          >
            <Label
              style={{
                width: 25,
                border: "1px solid #ccc",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fafafa",
                marginRight: 2
              }}
            >
              {idx}
            </Label>
            <div
              style={{
                flexGrow: 1,
                marginRight: 5,
                border: 0,
                borderTopWidth: 1,
                borderRightWidth: 1,
                borderColor: "#ccc",
                borderStyle: "solid"
              }}
            >
              <VariableComponent
                index={idx}
                props={source.items}
                setProps={setVariable}
                data={item}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
});
