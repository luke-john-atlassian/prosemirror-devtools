import * as React from "react";
import Select from "react-select";
import styled from "@emotion/styled";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { useAppState, useRegisteredAppState } from "./AppStateProvider";

import { History } from "./TabPanels/History/History";
import { State } from "./TabPanels/State/State";
import { TabBar } from "./components/TabBar";
import { Playground } from "./TabPanels/Playground/Playground";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow-y: hidden;
  height: 100%;
  max-height: 100%;

  > :first-child {
    z-index: 100;
  }
  > :last-child {
    overflow-y: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`;

export function RegisteredApp() {
  const appState = useRegisteredAppState();
  const [selectedTabIndex, setSelectedTabIndex] = React.useState<number>(1);

  return (
    <PageWrapper>
      <TabBar
        selectedTabIndex={selectedTabIndex}
        setSelectedTabIndex={setSelectedTabIndex}
      />
      <div>
        {appState.selectedEditorId ? (
          <>
            <TabPanel value={selectedTabIndex} index={0}>
              <State />
            </TabPanel>
            <TabPanel value={selectedTabIndex} index={1}>
              <History />
            </TabPanel>
            <TabPanel value={selectedTabIndex} index={2}>
              <Playground />
            </TabPanel>
          </>
        ) : (
          <>
            <p>Select an editor</p>
          </>
        )}
      </div>
    </PageWrapper>
  );
}

function TabPanel(props: {
  value: any;
  children: React.ReactNode;
  index: number;
}) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      style={{ flex: "1 auto", maxHeight: "100%", height: "100%" }}
      {...other}
    >
      {value === index && children}
    </div>
  );
}
