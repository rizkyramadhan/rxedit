import _ from 'lodash';
import { observer, useObservable } from 'mobx-react-lite';
import { Label, Link, PrimaryButton, TextField } from 'office-ui-fabric-react';
import React from 'react';

export default observer(({ data }: any) => {
  data = useObservable({
    path: '../app/src/'
  });
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div style={{ width: 400, height: 200 }}>
        <Label style={{ fontSize: 16 }}> Load Project from:</Label>
        <TextField
          defaultValue={data.path}
          onChange={e => {
            let val = _.get(e, 'nativeEvent.target.value');
            data.path = val;
          }}
        />
        <div
          style={{
            marginTop: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <PrimaryButton
            onClick={e => {
              window.localStorage['rx-edit-path'] = data.path;
              window.location.reload();
            }}
            text='Submit'
            style={{ marginRight: 10 }}
          />
          <div>
            or
            <Link style={{ marginLeft: 10 }}>Create new Project</Link>
          </div>
        </div>
      </div>
    </div>
  );
});
