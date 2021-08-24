import * as React from "react";
import Select from "react-select";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import MuiTabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useAppDispatch, useAppState } from "../AppStateProvider";

function getSelectValue(created: number) {
  const date = new Date(created);
  return {
    value: created,
    // TODO add active editor indicator
    // (requires new subscription, or update to existing _trackedPmEditors subsciption)
    label: `Created: ${date.toLocaleTimeString()}.${date.getMilliseconds()}`,
  };
}

export function TabBar({
  selectedTabIndex,
  setSelectedTabIndex,
}: {
  selectedTabIndex: number;
  setSelectedTabIndex: (cb: (tab: number) => number) => void;
}) {
  const classes = useStyles();
  const appState = useAppState();
  const appDispatch = useAppDispatch();

  let tabsEnabled = appState.status === "registered";

  const editorOptions = appState.trackedPmEditors?.map((trackedPmEditor) => {
    return getSelectValue(trackedPmEditor.created);
  });

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      className={classes.appBar}
    >
      <MuiTabs
        value={tabsEnabled ? selectedTabIndex : false}
        onChange={(_event, value) => setSelectedTabIndex(() => value)}
        indicatorColor="primary"
        textColor="primary"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
        className={classes.tabs}
      >
        <Tab
          label="Current State"
          className={classes.tab}
          disabled={!tabsEnabled}
        />
        <Tab label="History" className={classes.tab} disabled={!tabsEnabled} />
        <Tab
          label="Transaction playground"
          className={classes.tab}
          disabled={!tabsEnabled}
        />
      </MuiTabs>
      <Select
        onChange={(option) => {
          // @ts-ignore
          const editorId = option.value as any;
          appDispatch({ type: "changeEditor", editorId });
          setSelectedTabIndex((prevValue) =>
            prevValue === undefined ? 1 : prevValue
          );
        }}
        value={
          appState.selectedEditorId
            ? getSelectValue(appState.selectedEditorId)
            : null
        }
        options={editorOptions}
        styles={selectStyles}
        isSearchable={false}
        placeholder="Select editor..."
      />
    </AppBar>
  );
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f1f3f4",
    borderBottom: "1px solid #cacdd1",
  },
  tabs: {
    minHeight: "26px",
    backgroundColor: "#f1f3f4",
    // borderBottom: "1px solid #cacdd1",
  },
  tab: {
    minHeight: "26px",
    fontSize: "0.75rem",
    padding: "2px 10px",
    minWidth: "91px",
    textTransform: "none",
  },
  tabPanelRoot: {
    padding: 0,
  },
}));

const selectHeight = "27px";

const selectStyles: React.ComponentProps<typeof Select>["styles"] = {
  indicatorsContainer: (base) => ({
    ...base,
    height: selectHeight,
  }),
  clearIndicator: (provided) => ({
    ...provided,
    padding: "5px",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: "5px",
  }),
  container: (base) => ({
    ...base,
    fontSize: "12px",
  }),
  menu: (base) => ({
    ...base,
    marginTop: 0,
  }),
  menuList: (base) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
  }),
  control: (base) => ({
    ...base,
    border: "none",
    outline: "none",
    boxShadow: "none",
    borderLeft: "1px solid #cacdd1",
    "&:hover": {
      borderLeft: "1px solid #cacdd1",
    },
    backgroundColor: "#f1f3f4",
    color: "#000000",
    borderRadius: 0,
    width: 250,
    height: selectHeight,
    minHeight: selectHeight,
  }),
};
