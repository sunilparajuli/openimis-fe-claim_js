import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  withTheme,
  withStyles,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { useModulesManager, useTranslations } from "@openimis/fe-core";
import { fetchClaimHistory } from "../actions";

const styles = (theme) => ({
  panel: {
    margin: theme.spacing(0),
    '&:before': {
      display: 'none',
    },
  },
  panelSummary: {
    backgroundColor: theme.paper.header.backgroundColor,
    color: theme.palette.primary.main,
    minHeight: '36px !important',
    '&$expanded': {
      minHeight: '36px !important',
    },
  },
  panelExpandIcon: {
    color: theme.palette.primary.main,
  },
  panelSummaryContent: {
    margin: 0,
    '&$expanded': {
      margin: 0,
    },
  },
  expanded: {},
  panelTitle: {
    fontSize: '1.25rem',
    fontWeight: 500,
  },
  tableContainer: {
    width: '100%',
    boxShadow: 'none',
    backgroundColor: theme.paper.body.backgroundColor,
    padding: theme.spacing(0),
  },
  tableHeader: {
    backgroundColor: theme.palette.grey[300],
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2),
    width: '100%',
  },
});

const ClaimHistoryPanel = ({ claim, claimUuid, onViewVersion, classes }) => {
  const dispatch = useDispatch();
  const { history, fetchingHistory, errorHistory } = useSelector((state) => state.claim);
  const modulesManager = useModulesManager();
  const { formatMessage, formatMessageWithValues } = useTranslations("claim", modulesManager);
  const [expanded, setExpanded] = React.useState(false);

  useEffect(() => {
    if (expanded && claimUuid && !history) {
      dispatch(fetchClaimHistory(claimUuid));
    }
  }, [expanded, claimUuid, dispatch, history]);

  const handleChange = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  const fakeHistory = [
    {
      id: 1,
      createdDate: "2022-01-01",
      createdBy: {
        username: "system",
      },
      claimAmount: 100,
      status: "Submitted",
    },
    {
      id: 2,
      createdDate: "2022-01-02",
      createdBy: {
        username: "danilo",
      },
      claimAmount: 200,
      status: "Approved",
    },
    {
      id: 3,
      createdDate: "2022-01-03",
      createdBy: {
        username: "atangana",
      },
      claimAmount: 300,
      status: "Rejected",
    },
    {
      id: 4,
      createdDate: "2022-01-04",
      createdBy: {
        username: "paul",
      },
      claimAmount: 400,
      status: "Submitted",
    },
  ];

  return (
    <Paper className={classes.paper}>
      <ExpansionPanel 
        className={classes.panel}
        expanded={expanded} 
        onChange={handleChange}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon className={classes.panelExpandIcon} />}
          classes={{
            root: classes.panelSummary,
            content: classes.panelSummaryContent,
            expanded: classes.expanded,
          }}
        >
          <Typography className={classes.panelTitle}>
            {formatMessageWithValues("ClaimHistoryModal.title", { code: claim?.code || '' })}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.panelsDetails}>
          {fetchingHistory ? (
            <Box className={classes.loadingContainer}>
              <CircularProgress />
            </Box>
          ) : errorHistory ? (
            <Box color="error.main" p={2} width="100%">
              {errorHistory}
            </Box>
          ) : (
            <TableContainer component={Paper} className={classes.tableContainer}>
              <Table size="small">
                <TableHead className={classes.tableHeader}>
                  <TableRow>
                    <TableCell className={classes.tableHeaderCell}>
                      {formatMessage("ClaimHistoryModal.date")}
                    </TableCell>
                    <TableCell className={classes.tableHeaderCell}>
                      {formatMessage("ClaimHistoryModal.modifiedBy")}
                    </TableCell>
                    <TableCell className={classes.tableHeaderCell}>
                      {formatMessage("ClaimHistoryModal.claimAmount")}
                    </TableCell>
                    <TableCell className={classes.tableHeaderCell}>
                      {formatMessage("ClaimHistoryModal.status")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fakeHistory.map((version) => (
                    <TableRow 
                      key={version.id} 
                      hover 
                      onClick={() => onViewVersion(version)}
                      style={{ cursor: 'pointer' }}
                    >
                      <TableCell>{new Date(version.validityTo).toLocaleString()}</TableCell>
                      <TableCell>{version.createdBy?.username || 'System'}</TableCell>
                      <TableCell>{version.claimed}</TableCell>
                      <TableCell>{version.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Paper>
  );
};

export default withTheme(withStyles(styles)(ClaimHistoryPanel));
