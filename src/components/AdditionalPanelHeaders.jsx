import React, { Fragment } from "react";

import { Grid, Typography, Divider } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { FormattedMessage } from "@openimis/fe-core";

export const useStyles = makeStyles((theme) => ({
  tableHeader: theme.table.header,
  item: theme.paper.item,
}));

const AdditionalPanelHeaders = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <Grid item xs={6} className={classes.item}>
        <Typography className={classes.tableTitle}>
          <FormattedMessage module="claim" id="ClaimMasterPanelExt.InsureeInfo.Header" />
        </Typography>
        <Divider />
      </Grid>
      <Grid item xs={6} className={classes.item}>
        <Typography className={classes.tableTitle}>
          <FormattedMessage module="claim" id="ClaimMasterPanelExt.InsureeInfo.lastClaimSameDiagnosis.Header" />
        </Typography>
        <Divider />
      </Grid>
    </Fragment>
  );
};

export default AdditionalPanelHeaders;
