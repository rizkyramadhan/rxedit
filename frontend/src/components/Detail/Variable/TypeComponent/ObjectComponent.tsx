import { useObservable, observer } from "mobx-react-lite";
import { TextField } from "office-ui-fabric-react";
import React, { useEffect } from "react";
import VariableComponent from "../VariableComponent";

export default observer(({ props, setProps }: any) => {
  const source = useObservable({
    items: [] as any
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
            <TextField
              autoAdjustHeight
              placeholder="key"
              rows={3}
              value={item.key}
              onChange={(_e: any, val: any) => {
                let items = source.items;
                items[idx].key = val;
                setVariable(items);
              }}
              styles={{
                root: {
                  width: 80,
                  marginRight: 5,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderStyle: "solid",
                  justifyContent: "center",
                  flex: 1,
                  display: "flex"
                },
                fieldGroup: {
                  border: 0,
                  flexGrow: 1
                },
                wrapper: {
                  display: "flex",
                  flex: 1,
                  alignItems: "center",
                  flexDirection: "column"
                }
              }}
            />
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
                data={item}
                props={source.items}
                setProps={setVariable}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
});
