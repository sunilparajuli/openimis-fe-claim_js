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
    margin: theme.spacing(1),
    backgroundColor: theme.palette.common.white,
    '&:before': {
      display: 'none',
    },
  },
  panelSummary: {
    backgroundColor: theme.paper.header.backgroundColor,
    color: theme.palette.primary.main,
    minHeight: '48px !important',
    '&$expanded': {
      minHeight: '48px !important',
    },
  },
  panelExpandIcon: {
    color: theme.palette.primary.main,
  },
  panelSummaryContent: {
    margin: '12px 0',
    '&$expanded': {
      margin: '12px 0',
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
  },
  tableHeader: {
    backgroundColor: theme.palette.grey[200],
  },
  tableHeaderCell: {
    fontWeight: 500,
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

  return (
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
      <ExpansionPanelDetails>
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
                    {formatMessage("ClaimHistoryModal.version")}
                  </TableCell>
                  <TableCell className={classes.tableHeaderCell}>
                    {formatMessage("ClaimHistoryModal.date")}
                  </TableCell>
                  <TableCell className={classes.tableHeaderCell}>
                    {formatMessage("ClaimHistoryModal.modifiedBy")}
                  </TableCell>
                  <TableCell className={classes.tableHeaderCell}>
                    {formatMessage("ClaimHistoryModal.status")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history?.map((version) => (
                  <TableRow 
                    key={version.id} 
                    hover 
                    onClick={() => onViewVersion(version)}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell>{version.versionNumber}</TableCell>
                    <TableCell>{new Date(version.createdDate).toLocaleString()}</TableCell>
                    <TableCell>{version.createdBy?.username || 'System'}</TableCell>
                    <TableCell>{version.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default withTheme(withStyles(styles)(ClaimHistoryPanel));
