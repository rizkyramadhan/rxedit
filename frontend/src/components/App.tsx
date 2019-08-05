import _ from 'lodash';
import { observer, useObservable } from 'mobx-react-lite';
import { Customizer, Label, Link } from 'office-ui-fabric-react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import SplitPane from 'react-split-pane';
import { Api } from '../api/Api';
import Detail from './Detail/Detail';
import FileTree, { sortFileTree } from './Files/FileTree';
import RootDrop from './Files/RootDrop';
import Start from './Project/Start';

export default observer(() => {
  const data = useObservable({
    project: '',
    dir: [] as any[],
    selected: '',
    draghovered: '',
    contextmenu: '',
    loading: true
  });

  useEffect(loadDir.bind(data), []);
  useEffect(loadProject.bind(data), []);
  useEffect(expandDir.bind(data), [data.selected]);
  if (!data.project) {
    if (data.loading) {
      return <div />;
    }

    return <Start data={data} />;
  }

  return (
    <Customizer>
      <SplitPane minSize={280}>
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%'
          }}
        >
          <SplitPane
            style={{ flex: 1 }}
            primary={'second'}
            maxSize={50}
            split={'horizontal'}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'stretch',
                flexDirection: 'column'
              }}
            >
              <CommandBar
                className='app-command-bar'
                overflowItems={[]}
                items={[
                  {
                    key: 'search',
                    onRender: () => {
                      return (
                        <SearchBox
                          placeholder='Search'
                          underlined={false}
                          styles={{
                            root: {
                              width: 200,
                              border: 0,
                              borderRadius: 0,
                              minHeight: 43
                            }
                          }}
                        />
                      );
                    }
                  }
                ]}
                farItems={[
                  {
                    key: 'refresh',
                    iconProps: {
                      style: {
                        color: '#999'
                      },
                      iconName: 'Refresh'
                    },
                    style: {
                      borderRight: '1px solid #ececeb',
                      borderLeft: '1px solid #ececeb'
                    },
                    onClick: () => {
                      data.dir = [];
                      loadDir.bind(data)();
                    }
                  },
                  {
                    key: 'newItem',
                    subMenuProps: {
                      items: [
                        {
                          key: 'newFile',
                          iconProps: {
                            iconName: 'FileHTML',
                            style: {
                              color: 'purple'
                            }
                          },
                          name: 'New Component',
                          onClick: () => {
                            data.dir.push({
                              isNew: true,
                              type: 'file',
                              name: '.tsx',
                              relativePath: './.tsx'
                            });
                          }
                        },
                        {
                          key: 'newDir',
                          iconProps: {
                            iconName: 'Folder',
                            style: {
                              color: '#222'
                            }
                          },
                          name: 'New Folder',
                          onClick: () => {
                            data.dir.push({
                              isNew: true,
                              type: 'dir',
                              name: '',
                              children: [],
                              relativePath: './'
                            });
                          }
                        }
                      ]
                    }
                  }
                ]}
              />
              <div
                style={{
                  position: 'relative',
                  height: '100%'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    overflow: 'auto',
                    bottom: 0
                  }}
                >
                  <DndProvider backend={HTML5Backend}>
                    <FileTree
                      path='./'
                      contextmenu={data.contextmenu}
                      onContextMenu={(file: any) => {
                        data.contextmenu = file.relativePath;
                      }}
                      onSelect={(file: any) => {
                        if (file.type === 'file')
                          data.selected = file.relativePath;
                      }}
                      onDragHover={(from: any, to: any) => {
                        if (to.type === 'dir') {
                          data.draghovered = to.relativePath;
                          setTimeout(() => {
                            to.expanded = true;
                          }, 300);
                        } else data.draghovered = '';
                      }}
                      onDrop={(from: any, to: any, dropIndex: number) => {
                        data.draghovered = '';
                        if (from.path.indexOf(from.file.relativePath) === 0) {
                          return;
                        }
                        if (
                          to.type === 'dir' &&
                          to.children &&
                          to.children.indexOf(from.file) < 0
                        ) {
                          if (data.selected === from.file.relativePath) {
                            setTimeout(() => {
                              data.selected = from.path + from.file.name;
                            });
                          }
                          Api.move(
                            from.file.relativePath,
                            from.path + '/' + from.file.name
                          );
                          from.file.relativePath = from.path + from.file.name;
                          to.children.push(from.file);
                          from.parent.splice(from.index, 1);
                          from.index = dropIndex;
                        }
                      }}
                      draghovered={data.draghovered}
                      selected={data.selected}
                      level={0}
                      dir={data.dir}
                    />
                    <RootDrop
                      onDrop={(from: any) => {
                        if (data.dir.indexOf(from.file) < 0) {
                          Api.move(
                            from.file.relativePath,
                            './' + from.file.name
                          );
                          data.draghovered = '';
                          from.file.relativePath = './' + from.file.name;
                          from.parent.splice(from.index, 1);
                          data.dir.push(from.file);
                        }
                      }}
                    />
                  </DndProvider>
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'space-between',
                padding: '0 20px'
              }}
            >
              <Label
                style={{
                  color: '#999',
                  fontSize: 12
                }}
              >
                {data.project}
              </Label>
              <Link style={{ fontSize: 10 }} onClick={() => {}}>
                Reset
              </Link>
            </div>
          </SplitPane>
        </div>
        <Detail data={data} />
      </SplitPane>
    </Customizer>
  );
});

const loadDir: any = function(this: any) {
  const data = this;
  data.loading = true;
  const load = async () => {
    data.dir = sortFileTree(await Api.dir());
    expandDir.bind(data)();
    data.loading = false;
  };
  load();
  return () => {};
};

const loadProject: any = function(this: any) {
  const data = this;
  data.loading = true;

  const load = async () => {
    data.project = await Api.loadProject();
    data.loading = false;
  };
  load();
  return () => {};
};

const recurseExpandFind = (array: any[], find: string, parent?: any) => {
  let found = undefined;
  _.each(array, i => {
    if (i.relativePath === find) {
      found = i;
      if (parent) {
        parent.expanded = true;
      }
    } else if (i.children) {
      let f: any = recurseExpandFind(i.children, find, i);
      if (f) {
        found = f;
        if (parent) {
          parent.expanded = true;
        }
      }
    }
  });
  return found;
};

const expandDir: any = function(this: any) {
  const data = this;
  if (data.selected) {
    recurseExpandFind(data.dir, data.selected);
  }
};
