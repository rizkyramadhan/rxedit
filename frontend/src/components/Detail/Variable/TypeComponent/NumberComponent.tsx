import { observer } from "mobx-react-lite";
import { TextField } from "office-ui-fabric-react";
import React from "react";

export default observer(({ props }: any) => {
  props.value =
    !!props.value && typeof props.value === "number" ? props.value : 0;
  return (
    <TextField
      rows={1}
      value={props.value.toString()}
      onChange={(_e: any, val: any) => {
        props.value = parseInt(val.replace(/\D/g, "") || "0");
      }}
    />
  );
});
