import { observer } from "mobx-react-lite";
import { TextField } from "office-ui-fabric-react";
import React, { useEffect } from "react";

export default observer(({ props, setProps }: any) => {
  const setVariable = (value: any) => {
    let item = props;
    item.value = value;
    setProps(item);
  };
  useEffect(() => {
    let value =
      !!props.value && typeof props.value === "string" ? props.value : "";
    setVariable(value);
  }, [props]);
  return (
    <TextField
      multiline
      autoAdjustHeight
      rows={6}
      value={props.value}
      onChange={(_e: any, val: any) => {
        setVariable(val);
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
