import { observer } from "mobx-react-lite";
import { ChoiceGroup, IChoiceGroupOptionStyles } from "office-ui-fabric-react";
import React from "react";

export default observer(({ props }: any) => {
  props.value =
    !!props.value && typeof props.value === "boolean" ? props.value : false;
  return (
    <ChoiceGroup
      className="defaultChoiceGroup"
      defaultSelectedKey={`${props.value}`}
      onChange={(_e: any, item: any) => {
        props.value = item.key === "true";
      }}
      options={[
        {
          key: "true",
          text: "True",
          styles: optionStyles
        },
        {
          key: "false",
          text: "False",
          styles: optionStyles
        }
      ]}
      styles={{
        flexContainer: {
          flexDirection: "row",
          display: "flex"
        }
      }}
    />
  );
});

const optionStyles: Partial<IChoiceGroupOptionStyles> = {
  root: {
    flexGrow: 1
  }
};
