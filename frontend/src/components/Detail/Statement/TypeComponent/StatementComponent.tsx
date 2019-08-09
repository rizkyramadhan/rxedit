import React from "react";
import { TextField } from "office-ui-fabric-react";
import { observer } from "mobx-react-lite";

export default observer(({ value, setValue }: any) => {
  return (
    <TextField
      placeholder="<Empty>"
      multiline
      autoAdjustHeight
      rows={6}
      value={value}
      onChange={(_e: any, newVal: any) => {
        setValue("value", newVal);
      }}
      styles={{
        fieldGroup: {
          border: 0
        }
      }}
    />
  );
});
