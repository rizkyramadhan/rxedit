import {
  CommandBarButton,
  Dropdown,
  DropdownMenuItemType,
  IButtonStyles,
  Icon,
  IconButton,
  IDropdownOption,
  IDropdownStyles,
  ITextFieldStyles,
  TextField
} from "office-ui-fabric-react";
import React, { useEffect, useState } from "react";
import ArrayComponent from "./TypeComponent/ArrayComponent";
import BooleanComponent from "./TypeComponent/BooleanComponent";
import FunctionComponent from "./TypeComponent/FunctionComponent";
import NumberComponent from "./TypeComponent/NumberComponent";
import ObjectComponent from "./TypeComponent/ObjectComponent";
import StringComponent from "./TypeComponent/StringComponent";
import { useObservable, observer } from "mobx-react-lite";

export const optionsDataType: IDropdownOption[] = [
  { key: "reactComponent", text: "React Component" },
  { key: "function", text: "Function" },
  { key: "divider_1", text: "-", itemType: DropdownMenuItemType.Divider },
  { key: "array", text: "Array" },
  { key: "object", text: "Object" },
  { key: "divider_2", text: "-", itemType: DropdownMenuItemType.Divider },
  { key: "number", text: "Number" },
  { key: "string", text: "String" },
  { key: "boolean", text: "Boolean" },
  { key: "divider_3", text: "-", itemType: DropdownMenuItemType.Divider },
  { key: "null", text: "Null" },
  { key: "undifined", text: "Undefined" }
];

export default observer(({ index, props, setProps, data }: any) => {
  const source = useObservable({
    name: "string" as string,
    type: "const" as string,
    dataType: "string" as string,
    value: null as any
  });

  const [editedName, setEditedName] = useState(false);
  const setVariable = (value: any) => {
    Object.keys(value).forEach((x: string) => {
      (source as any)[x] = value[x];
    });
    let items = props;
    items[index] = source;
    setProps([...items]);
  };

  useEffect(() => {
    setVariable(data);
  }, [data]);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        minHeight: 100,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        borderStyle: "solid"
      }}
    >
      <div
        style={{
          position: "relative",
          flex: " 0 0 22px",
          backgroundColor: source.type === "const" ? "#fafafa" : "transparent",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRight: "1px solid #ccc"
        }}
      >
        <Dropdown
          onRenderOption={typeRenderOption as any}
          onRenderCaretDown={() => <div />}
          styles={typeDropdownStyles}
          defaultSelectedKey={source.type}
          options={[
            { key: "const", text: "const", data: { icon: "Uneditable" } },
            { key: "let", text: "let", data: { icon: "Edit" } }
          ]}
          onChange={(_e: any, val: any) => {
            let item = { ...source };
            item.type = val.key;
            setVariable(item);
          }}
        />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {editedName ? (
          <div
            style={{
              borderBottom: "1px solid #ccc",
              padding: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <TextField
              value={source.name}
              onChange={(_e: any, val: any) => {
                let item = { ...source };
                item.name = val.replace(/^[^a-zA-Z_$][^a-zA-Z_$0-9]*$/, "");
                setVariable(item);
              }}
              styles={nameFieldStyle}
              autoFocus
              onBlur={() => {
                if (!!source.name) setEditedName(false);
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
              padding: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <CommandBarButton
              text={source.name}
              onClick={() => {
                setEditedName(true);
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
                defaultSelectedKey={source.dataType}
                onChange={(_e: any, val: any) => {
                  let item = { ...source };
                  item.dataType = val.key;
                  setVariable(item);
                }}
              />
              {
                ({
                  array: (
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
                        let item = { ...source };
                        item.value.push({
                          name: "string" as string,
                          type: "const" as string,
                          dataType: "string" as string,
                          value: null as any
                        });
                        setVariable(item);
                      }}
                    />
                  ),
                  object: (
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
                        let item = { ...source };
                        item.value.push({
                          key: source.value.length,
                          value: {
                            name: "string" as string,
                            type: "const" as string,
                            dataType: "string" as string,
                            value: null as any
                          }
                        });
                        setVariable(item);
                      }}
                    />
                  )
                } as any)[source.dataType]
              }
              <IconButton
                iconProps={{ iconName: "CircleAddition" }}
                title="Delete Variable"
                ariaLabel="Delete Variable"
                styles={{
                  root: {
                    height: 27
                  },
                  icon: {
                    transform: "rotate(45deg)",
                    color: "#d00000"
                  }
                }}
                onClick={() => {
                  let items = props;
                  items.splice(index, 1);
                  setProps([...items]);
                }}
              />
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
              // position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              // height: "100%",
              padding: 5
            }}
          >
            {
              ({
                function: (
                  <FunctionComponent props={source} setProps={setVariable} />
                ),
                string: (
                  <StringComponent props={source} setProps={setVariable} />
                ),
                number: (
                  <NumberComponent props={source} setProps={setVariable} />
                ),
                boolean: (
                  <BooleanComponent props={source} setProps={setVariable} />
                ),
                array: <ArrayComponent props={source} setProps={setVariable} />,
                object: (
                  <ObjectComponent props={source} setProps={setVariable} />
                )
              } as any)[source.dataType]
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
    width: 60
  },
  root: {
    transform: "rotate(270deg)",
    width: 20,
    marginTop: 40
  },
  title: {
    backgroundColor: "#00000000",
    padding: 0,
    border: 0,
    height: 25,
    lineHeight: 23,
    textAlign: "right",
    paddingRight: 5
  },
  callout: {
    marginTop: -25,
    marginLeft: 25,
    minWidth: 100
  }
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
