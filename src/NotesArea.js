// @flow

import React, { useState } from 'react';
import type { Node } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import AccessAlarmIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import {
  Editor,
  EditorState,
  ContentState,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';

import TabLabel from './TabLabel';

export type TTab = {
  id: string,
  label: string,
};

export type TTabs = $ReadOnlyArray<TTab>;

export function genId(): string {
  return `_${Math.random().toString(36).substr(2, 9)}`;
}

const tabsStorage: TTabs = [
  {
    id: genId(),
    label: 'text 1',
    rawContent: convertToRaw(ContentState.createFromText('Test 1')),
  },
  {
    id: genId(),
    label: 'text 2',
    rawContent: convertToRaw(ContentState.createFromText('Test 2')),
  },
  {
    id: genId(),
    label: 'text 3',
    rawContent: convertToRaw(ContentState.createFromText('Test 3')),
  },
];


function getEditorState(tabs, currentTab) {
  const tabObject = tabs.find((t): boolean => t.id === currentTab);
  const contentState = convertFromRaw(tabObject.rawContent);
  return EditorState.createWithContent(contentState);
}

export default function NotesArea(): Node {
  const [tabs, setTabs] = useState(tabsStorage);
  const [currentTab, setCurrentTab] = useState(tabs[0].id);
  const [editorState, setEditorState] = useState(getEditorState(tabs, currentTab));

  function handleAdd(event): boolean {
    event.stopPropagation();
    event.preventDefault();
    const id = genId();

    setTabs([
      ...tabs,
      {
        id,
        label: `Tab ${tabs.length + 1}`,
        rawContent: null,
      },
    ]);
    setCurrentTab(id);

    return false;
  }

  function handleRemove(id: string) {
    setCurrentTab(tabs[0].id);
    setTabs(tabs.filter((t): boolean => t.id !== id));
  }

  function handleTabChange(event, newTab) {
    setCurrentTab(newTab);
    setEditorState(
      getEditorState(tabs, newTab)
    );
  }

  function handleEditorChange(newEditorState) {
    setTabs(
      tabs.map(t => {
        if (t.id === currentTab) {
          return {
            ...t,
            rawContent: convertToRaw(editorState.getCurrentContent()),
          };
        }

        return t;
      })
    );
    setEditorState(newEditorState);
  }

  return (
    <React.Fragment>
      <Tabs
        onChange={handleTabChange}
        value={currentTab}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs.map(({ id, label }): Node => (
          <Tab
            component="div"
            key={id}
            value={id}
            label={(
              <TabLabel
                id={id}
                label={label}
                onRemove={handleRemove}
              />
            )}
          />
        ))}
        <Tab
          component="div"
          key="add_tab"
          value="add_tab"
          onClick={handleAdd}
          label={(
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
              <Grid item xs={3}>
                <IconButton
                  color="primary"
                >
                  <AccessAlarmIcon />
                </IconButton>
              </Grid>
            </Grid>
          )}
        />
      </Tabs>
      <Editor
        editorState={editorState}
        onChange={handleEditorChange}
      />
    </React.Fragment>
  );
}
