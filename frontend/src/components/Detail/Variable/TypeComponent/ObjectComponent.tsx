import { observer } from "mobx-react-lite";
import { IconButton, TextField } from "office-ui-fabric-react";
import React from "react";

export default observer(({ props }: any) => {
  props.value =
    !!props.value && typeof props.value === "object" ? props.value : [];
  return (
    <div>
      {props.value.map((item: any, idx: number) => {
        return (
          <div
            key={idx}
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "row"
            }}
          >
            <TextField
              autoAdjustHeight
              placeholder="key"
              rows={3}
              value={item.key}
              onChange={(_e: any, val: any) => {
                let items = props.value;
                items[idx].key = val;
                props.value = [...items];
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
            <TextField
              placeholder="value"
              multiline
              autoAdjustHeight
              rows={3}
              value={item.value}
              onChange={(_e: any, val: any) => {
                let items = props.value;
                items[idx].value = val;
                props.value = [...items];
              }}
              styles={{
                root: {
                  flexGrow: 1,
                  marginRight: 5
                },
                fieldGroup: {
                  borderColor: "#ccc"
                }
              }}
            />
            <div
              style={{
                flexDirection: "column",
                display: "flex"
              }}
            >
              <IconButton
                primary
                iconProps={{ iconName: "Delete" }}
                title="Delete"
                ariaLabel="Delete"
                styles={{
                  rootHovered: {
                    backgroundColor: "#d0000040"
                  },
                  iconHovered: {
                    color: "#d00000"
                  },
                  root: {
                    color: "#d00000",
                    width: 35,
                    marginRight: 5,
                    flexGrow: 1
                  }
                }}
                onClick={() => {
                  let items = props.value;
                  items.splice(idx, 1);
                  props.value = [...items];
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
});
