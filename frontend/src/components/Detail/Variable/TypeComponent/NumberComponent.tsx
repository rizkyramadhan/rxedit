import { observer } from 'mobx-react-lite';
import { TextField } from 'office-ui-fabric-react';
import React from 'react';

export default observer(({ value, setValue }: any) => {
  return (
    <TextField
      rows={1}
      value={value.toString()}
      onChange={(_e: any, val: any) => {
        setValue(parseInt(val.replace(/\D/g, '') || '0'));
      }}
    />
  );
});
