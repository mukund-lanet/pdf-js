'use client';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from "@trenchaant/pkg-ui-component-library/build/Components/Tabs";
import Tab from "@trenchaant/pkg-ui-component-library/build/Components/Tab";
import CustomIcon from '@trenchaant/pkg-ui-component-library/build/Components/CustomIcon';
import styles from 'app/(after-login)/(with-header)/contract-management/pdfEditor.module.scss';
import { DRAWER_COMPONENT_CATEGORY } from '../../types';
import { RootState } from '../../store/reducer/pdfEditor.reducer';

const EditorLeftSidebar = () => {
  const dispatch = useDispatch();
  const drawerComponentType = useSelector((state: RootState) => state?.pdfEditor?.pdfEditorReducer?.drawerComponentCategory);

  const tabItems = {
    [DRAWER_COMPONENT_CATEGORY.ADD_ELEMENTS]: {
      name: "Elements",
      icon: "square",
      title: "Add elements",
      description: "Drag components into your document",
    },
    [DRAWER_COMPONENT_CATEGORY.PAGES]: {
      name: "Pages",
      icon: "layers",
      title: "Page Manager",
      description: "Organize and manage document pages",
    },
    [DRAWER_COMPONENT_CATEGORY.DOCUMENT_VARIABLES]: {
      name: "Variables",
      icon: "braces",
      title: "Document Variables",
      description: "Create and manage dynamic variables",
    },
    [DRAWER_COMPONENT_CATEGORY.SETTINGS]: {
      name: "Settings",
      icon: "settings",
      title: "Document Settings",
      description: "Configure document preferences",
    },
  };

  return (
    <Tabs
      indicatorColor="primary"
      textColor="primary"
      value={drawerComponentType}
      className={styles.leftSideTabs}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => dispatch({ type: 'SET_DRAWER_COMPONENT_CATEGORY', payload: event.target.value })}
    >
      {Object.entries(tabItems).map(([value, item]) => (
        <Tab
          key={value}
          className={styles.leftSideTab}
          classes={{ root: styles.leftSideTabRoot }}
          icon={<CustomIcon iconName={item.icon} height={16} width={16} variant='gray' />}
          label={item.name}
          value={value}
        />
      ))}
    </Tabs>
  );
};

export default EditorLeftSidebar;
