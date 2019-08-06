import React from "react";
import { TextField } from "office-ui-fabric-react";
import { observer } from "mobx-react-lite";

export default observer(({ props }: any) => {
  return <TextField multiline autoAdjustHeight rows={6} />;
});
