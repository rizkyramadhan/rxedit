import { observer } from "mobx-react-lite";
import { TextField } from "office-ui-fabric-react";
import React from "react";

export default observer(({ props }: any) => {
  props.value =
    !!props.value && typeof props.value === "string" ? props.value : "";
  return (
    <TextField
      multiline
      autoAdjustHeight
      rows={6}
      value={props.value}
      onChange={(_e: any, val: any) => {
        props.value = val;
      }}
      styles={{
        fieldGroup: {
          borderColor: "#ccc"
        }
      }}
      placeholder="value"
    />
  );
});
