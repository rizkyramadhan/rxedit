import { observer, useObservable } from "mobx-react-lite";
import { Callout, Label } from "office-ui-fabric-react";
import React, { useRef } from "react";
import { detailAttrStyle } from "./Statement/Variable";

export default observer(({ source }: any) => {
  const meta = useObservable({
    showImportPopup: false
  });
  const importButtonRef = useRef(null as any);

  return (
    <div style={{ height: 27 }}>
      <div
        ref={importButtonRef}
        style={{
          display: "inline-block",
          textAlign: "center"
        }}
      >
        <Label
          style={detailAttrStyle}
          onClick={() => {
            meta.showImportPopup = !meta.showImportPopup;
          }}
        >
          {source.import.length} Imports
        </Label>
      </div>
      <Callout
        role="alertdialog"
        gapSpace={0}
        target={importButtonRef.current}
        setInitialFocus={true}
        onDismiss={() => (meta.showImportPopup = false)}
        hidden={!meta.showImportPopup}
      >
        <div style={{ padding: 0, minWidth: 400 }}>
          {source.import.map((item: any) => {
            return (
              <div
                key={item.index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 10,
                  borderTop: item.index > 0 ? "1px solid #ccc" : 0
                }}
              >
                <div style={{textDecoration: 'underline'}}>
                  {item.default && <b>{item.default}</b>} {item.named}
                </div>
                <div>
                  <span style={{ color: "#aaa" }}>from</span> {item.from}
                </div>
              </div>
            );
          })}
        </div>
      </Callout>
    </div>
  );
});
