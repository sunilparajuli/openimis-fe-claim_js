import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Box,
} from "@material-ui/core";
import { Close as CloseIcon, Visibility as ViewIcon } from "@material-ui/icons";
import { formatMessage, useModulesManager, useTranslations } from "@openimis/fe-core";
import { fetchClaimHistory } from "../actions";
import { useIntl } from "react-intl";

const ClaimHistoryModal = ({ claim, claimUuid, open, onClose, onViewVersion }) => {
  const dispatch = useDispatch();
  const { history, fetchingHistory, errorHistory, fetchedHistory } = useSelector((state) => state.claim);
  const modulesManager = useModulesManager();
  const intl = useIntl();
  const { formatMessage, formatMessageWithValues } = useTranslations("claim", modulesManager);

  useEffect(() => {
    if (open && claimUuid) {
      dispatch(fetchClaimHistory(claimUuid));
    }
  }, [open, claimUuid, dispatch]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {formatMessageWithValues("ClaimHistoryModal.title", { code: claim.code })}
        <IconButton onClick={onClose} style={{ float: 'right' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {fetchingHistory ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress />
          </Box>
        ) : errorHistory ? (
          <Box color="error.main" p={2}>
            {errorHistory}
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{formatMessage("ClaimHistoryModal.version")}</TableCell>
                  <TableCell>{formatMessage("ClaimHistoryModal.date")}</TableCell>
                  <TableCell>{formatMessage("ClaimHistoryModal.modifiedBy")}</TableCell>
                  <TableCell>{formatMessage("ClaimHistoryModal.actions")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>297UVIUIOO</TableCell>
                  <TableCell>2025-09-17 13:08:36</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell>
                    <IconButton onClick={() => onViewVersion(version)}>
                      <ViewIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
                {history?.map((version) => (
                  <TableRow key={version.id}>
                    <TableCell>{version.versionNumber}</TableCell>
                    <TableCell>{new Date(version.createdDate).toLocaleString()}</TableCell>
                    <TableCell>{version.createdBy?.username || 'System'}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => onViewVersion(version)}>
                        <ViewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClaimHistoryModal;
