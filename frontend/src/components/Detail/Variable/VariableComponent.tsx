import { observer, useObservable } from "mobx-react-lite";
import {
  CommandBarButton,
  Dropdown,
  IButtonStyles,
  Icon,
  IDropdownOption,
  IDropdownStyles,
  ITextFieldStyles,
  TextField,
  IconButton
} from "office-ui-fabric-react";
import React from "react";
import ArrayComponent from "./TypeComponent/ArrayComponent";
import BooleanComponent from "./TypeComponent/BooleanComponent";
import FunctionComponent from "./TypeComponent/FunctionComponent";
import NumberComponent from "./TypeComponent/NumberComponent";
import StringComponent from "./TypeComponent/StringComponent";
import ObjectComponent from "./TypeComponent/ObjectComponent";

const optionsDataType: IDropdownOption[] = [
  { key: "null", text: "Null" },
  { key: "undifined", text: "Undefined" },
  { key: "function", text: "Function" },
  { key: "boolean", text: "Boolean" },
  { key: "number", text: "Number" },
  { key: "string", text: "String" },
  { key: "array", text: "Array" },
  { key: "object", text: "Object" },
  { key: "reactComponent", text: "React Component" }
];

interface VariableProps {
  type: "let" | "const";
}

export default observer(({ type = "const" }: VariableProps) => {
  const props = useObservable({
    name: "Data" as string,
    type: "const" as string,
    dataType: "array" as string,
    editedName: false as boolean,
    value: undefined as any
  });

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%"
      }}
    >
      <div
        style={{
          flex: " 0 0 22px",
          backgroundColor: type === "const" ? "#fafafa" : "transparent",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          userSelect: "none",
          borderRight: "1px solid #ccc"
        }}
      >
        <Dropdown
          onRenderTitle={typeRenderTitle as any}
          onRenderOption={typeRenderOption as any}
          onRenderCaretDown={() => <div />}
          styles={typeDropdownStyles}
          defaultSelectedKey={props.type}
          options={[
            { key: "const", text: "const", data: { icon: "Uneditable" } },
            { key: "let", text: "let", data: { icon: "Edit" } }
          ]}
        />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {props.editedName ? (
          <div
            style={{
              borderBottom: "1px solid #ccc",
              padding: "5px 0px 5px 5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <TextField
              value={props.name}
              onChange={(_e: any, val: any) => {
                props.name = val.replace(/^[^a-zA-Z_$][^a-zA-Z_$0-9]*$/, "");
              }}
              styles={nameFieldStyle}
              autoFocus
              onBlur={() => {
                if (!!props.name) props.editedName = false;
              }}
              borderless
              placeholder="<Empty>"
              iconProps={{ iconName: "EditStyle" }}
            />
          </div>
        ) : (
          <div
            style={{
              borderBottom: "1px solid #ccc",
              padding: "5px 0px 5px 5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <CommandBarButton
              data-automation-id="name"
              text={props.name}
              onClick={() => {
                props.editedName = true;
              }}
              styles={buttonNameStyles}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row"
              }}
            >
              <Dropdown
                options={optionsDataType}
                styles={dataTypeDropdownStyles}
                defaultSelectedKey={props.dataType}
                onChange={(_e: any, item: any) => {
                  props.dataType = item.key;
                }}
              />
              {props.dataType === "array" ? (
                <IconButton
                  iconProps={{ iconName: "CircleAddition" }}
                  title="Add Item"
                  ariaLabel="Add Item"
                  styles={{
                    root: {
                      height: 27
                    }
                  }}
                  onClick={() => {
                    props.value.push(undefined);
                  }}
                />
              ) : (
                <IconButton
                  iconProps={{ iconName: "CircleAddition" }}
                  title="Add Item"
                  ariaLabel="Add Item"
                  styles={{
                    root: {
                      height: 27
                    }
                  }}
                  onClick={() => {
                    props.value.push({ key: props.value.length, value: null });
                  }}
                />
              )}
            </div>
          </div>
        )}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%"
          }}
        >
          <div
            style={{
              margin: 0,
              flex: 1,
              overflowY: "auto",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "100%",
              padding: 10
            }}
          >
            {
              ({
                function: <FunctionComponent props={props} />,
                string: <StringComponent props={props} />,
                number: <NumberComponent props={props} />,
                boolean: <BooleanComponent props={props} />,
                array: <ArrayComponent props={props} />,
                object: <ObjectComponent props={props} />
              } as any)[props.dataType]
            }
          </div>
        </div>
      </div>
    </div>
  );
});

export const detailAttrStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: "bold",
  padding: "0px 7px 2px 7px",
  cursor: "pointer",
  userSelect: "none",
  marginRight: 5,
  color: "#666",
  borderRadius: 4,
  background: "#ececeb"
};

const dataTypeDropdownStyles: Partial<IDropdownStyles> = {
  dropdown: {
    minWidth: 60,
    maxWidth: 150,
    marginRight: 5
  },
  title: {
    lineHeight: 25,
    height: 27,
    border: 0,
    textAlign: "right"
  },
  caretDownWrapper: {
    lineHeight: 25,
    height: 27
  },
  root: {
    flexDirection: "column",
    justifyContent: "flex-end"
  },
  callout: {
    minWidth: 150
  }
};

const nameFieldStyle: Partial<ITextFieldStyles> = {
  root: {
    display: "flex",
    flex: 1,
    paddingLeft: 5
  },
  field: {
    display: "flex",
    flex: 1
  },
  wrapper: {
    display: "flex",
    flex: 1
  },
  fieldGroup: {
    display: "flex",
    flex: 1,
    height: 27
  }
};

const buttonNameStyles: Partial<IButtonStyles> = {
  label: {
    padding: 5,
    textOverflow: "elipsis",
    whiteSpace: "nowrap",
    overflow: "hidden"
  }
};

const typeDropdownStyles: Partial<IDropdownStyles> = {
  dropdown: {
    width: 80
  },
  root: {
    transform: "rotate(270deg)",
    position: "absolute",
    top: 25
  },
  title: {
    backgroundColor: "#00000000",
    padding: 0,
    border: 0,
    height: 25,
    lineHeight: 23,
    textAlign: "right"
  },
  callout: {
    marginTop: -75,
    marginLeft: 25,
    minWidth: 100
  }
};

const typeRenderTitle = (options: IDropdownOption[]): JSX.Element => {
  const option = options[0];

  return (
    <div>
      <span>{option.text}</span>
      {option.data && option.data.icon && (
        <Icon
          style={{ marginRight: 8, marginLeft: 8 }}
          iconName={option.data.icon}
          aria-hidden="true"
          title={option.data.icon}
        />
      )}
    </div>
  );
};

const typeRenderOption = (option: IDropdownOption): JSX.Element => {
  return (
    <div>
      {option.data && option.data.icon && (
        <Icon
          style={{ marginRight: "8px" }}
          iconName={option.data.icon}
          aria-hidden="true"
          title={option.data.icon}
        />
      )}
      <span>{option.text}</span>
    </div>
  );
};
