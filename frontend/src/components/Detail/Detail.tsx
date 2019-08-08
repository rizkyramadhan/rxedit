import _ from 'lodash';
import { observer, useObservable } from 'mobx-react-lite';
import { IconButton, Label } from 'office-ui-fabric-react';
import React, { useEffect } from 'react';
import SplitPane from 'react-split-pane';
import { Api } from '../../api/Api';
import VariableComponent, {
  detailAttrStyle,
  newValueByType
} from './Variable/VariableComponent';

const recurseFind = (array: any[], find: string) => {
  let found = undefined;
  _.each(array, i => {
    if (i.relativePath === find) {
      found = i;
    } else if (i.children) {
      let f = recurseFind(i.children, find);
      if (f) {
        found = f;
      }
    }
  });
  return found;
};

const Message = ({ text }: any) => (
  <div style={{ textAlign: 'center', padding: 100, color: '#ccc' }}>
    &mdash; {text} &mdash;
  </div>
);

export default observer(({ data }: any) => {
  const source = useObservable({
    import: [] as any,
    statements: [] as any
  });
  const file: any = recurseFind(data.dir, data.selected);
  useEffect(loadStructure.bind(source, file), [file]);

  if (data.loading) {
    return <Message text='Loading components' />;
  }
  if (!data.selected) {
    return <Message text='Please select a component' />;
  }
  if (!file) {
    return <Message text='Component not found, Please refresh the tree ' />;
  }
  const namesplit = file.name.split('.');
  namesplit.pop();
  const name = namesplit.join('.');
  return (
    <SplitPane minSize={400}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div
          style={{
            padding: '6px 0px 5px 15px',
            borderBottom: '1px solid #ccc',
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1
          }}
        >
          <Label
            style={{
              justifyContent: 'flex-start',
              display: 'flex',
              flexGrow: 1
            }}
          >
            {' '}
            {name || '_'}{' '}
          </Label>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Label style={detailAttrStyle}>
              {source.import.length} Imports
            </Label>
            <IconButton
              iconProps={{ iconName: 'CircleAddition' }}
              title='Add Variable'
              ariaLabel='Add Variable'
              styles={{
                root: {
                  height: 27
                }
              }}
              onClick={() => {
                source.statements.push({
                  name: 'NewVariable',
                  value: { '': '' }
                });
              }}
            />
          </div>
        </div>
        <SplitPane
          split='horizontal'
          minSize={91}
          primary='second'
          style={{ position: 'relative', height: '100%' }}
          paneStyle={{
            overflowY: 'auto'
          }}
        >
          <div>
            {source.statements.map((item: any, idx: number) => {
              return (
                <div
                  key={idx}
                  style={{
                    borderBottom: '1px solid #ccc'
                  }}
                >
                  <VariableComponent
                    name={item.name}
                    depth={0}
                    type={item.type}
                    value={item.value}
                    set={(kind: string, value: any) => {
                      source.statements[idx][kind] = value;
                      if (kind === 'type') {
                        source.statements[idx].value = newValueByType(value);
                      }
                    }}
                    unset={() => {
                      source.statements.splice(idx, 1);
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div />
        </SplitPane>
      </div>
      <div />
    </SplitPane>
  );
});

const loadStructure = function(this: any, file: any) {
  const fetch = async () => {
    if (file) {
      let source = await Api.source(file.relativePath);
      this.default = source.default;
      this.import = source.import;
    }
  };
  fetch();
};
