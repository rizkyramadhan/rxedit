import { observer } from 'mobx-react-lite';
import { ChoiceGroup, IChoiceGroupOptionStyles } from 'office-ui-fabric-react';
import React from 'react';

export default observer(({ value, setValue }: any) => {
  return (
    <ChoiceGroup
      className='defaultChoiceGroup'
      defaultSelectedKey={`${value}`}
      onChange={(_e: any, item: any) => {
        setValue(item.key === 'true');
      }}
      options={[
        {
          key: 'true',
          text: 'True',
          styles: optionStyles
        },
        {
          key: 'false',
          text: 'False',
          styles: optionStyles
        }
      ]}
      styles={{
        flexContainer: {
          flexDirection: 'row',
          display: 'flex'
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
