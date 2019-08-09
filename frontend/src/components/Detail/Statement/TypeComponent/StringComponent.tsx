import { observer } from 'mobx-react-lite';
import { TextField } from 'office-ui-fabric-react';
import React from 'react';

export default observer(({ value, setValue }: any) => {
  return (
    <TextField
      multiline
      resizable={false}
      spellCheck={false}
      autoAdjustHeight
      value={value}
      onChange={(_e: any, val: any) => {
        setValue(val);
      }}
      styles={{
        fieldGroup: {
          borderColor: '#ccc',
          border: 0
        }
      }}
      placeholder='value'
    />
  );
});
