import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    TableContainer,
    Paper,
    CircularProgress,
    Box,
} from "@mui/material";
import { useModulesManager, useTranslations, Table, formatDateFromISO, GetIconComponent, withModulesManager } from "@openimis/fe-core";
import { fetchClaimHistory } from "../actions";
import { styled } from "@mui/material/styles";
const ExpandMoreIcon = GetIconComponent("ExpandMore");
const StyledPaper = styled(Paper)(({ theme }) => ({
    ...(theme?.paper?.paper ?? {}),
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
    margin: theme.spacing(0),
    "&:before": {
        display: "none",
    },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
    backgroundColor:
        theme?.paper?.header?.backgroundColor ?? theme.palette.grey[100],
    color: theme.palette.primary.main,
    minHeight: "36px !important",

    "&.Mui-expanded": {
        minHeight: "36px !important",
    },

    "& .MuiAccordionSummary-content": {
        margin: 0,
    },

    "& .MuiAccordionSummary-content.Mui-expanded": {
        margin: 0,
    },

    "& .MuiAccordionSummary-expandIconWrapper": {
        color: theme.palette.primary.main,
    },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    width: "100%",
    boxShadow: "none",
    backgroundColor:
        theme?.paper?.body?.backgroundColor ??
        theme.palette.background.paper,
    padding: theme.spacing(0),
}));

const StyledLoadingContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(2),
    width: "100%",
}));

const PanelTitle = styled("span")({
    fontSize: "1.25rem",
    fontWeight: 500,
});

const ClaimHistoryPanel = ({ claim, claimUuid, onViewVersion }) => {
    const dispatch = useDispatch();
    const { history, fetchingHistory, errorHistory } = useSelector((state) => state.claim);
    const modulesManager = useModulesManager();
    const { formatMessage, formatMessageWithValues, formatDateFromISO, formatAmount } = useTranslations("claim", modulesManager);
    const [expanded, setExpanded] = React.useState(false);

    useEffect(() => {
        dispatch(fetchClaimHistory(claimUuid));
    }, [claimUuid, dispatch]);

    const handleChange = (event, isExpanded) => {
        setExpanded(isExpanded);
    };

    const headers = [
        "claimHistory.code",
        "claimHistory.dateClaimed",
        "claimHistory.dateProcessed",
        "claimHistory.feedbackStatus",
        "claimHistory.reviewStatus",
        "claimHistory.claimed",
        "claimHistory.approved",
        "claimHistory.status",
        "claimHistory.restoreId",
    ];

    const itemFormatters = [
        (claim) => claim.code || '—',
        (claim) => formatDateFromISO(claim.dateClaimed) || '—',
        (claim) => formatDateFromISO(claim.dateProcessed) || '—',
        (claim) => claim.feedbackStatus || '—',
        (claim) => claim.reviewStatus || '—',
        (claim) => claim.claimed ? formatAmount(claim.claimed) : '—',
        (claim) => claim.approved ? formatAmount(claim.approved) : '—',
        (claim) => claim.status || '—',
        (claim) => claim.restoreId || '—'
    ];

    return (
        <StyledPaper>
            <StyledAccordion
                expanded={expanded}
                onChange={handleChange}
            >
                <StyledAccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <PanelTitle>
                        {formatMessageWithValues("ClaimHistoryModal.title", { code: claim?.code || '' })}
                    </PanelTitle>
                </StyledAccordionSummary>
                <AccordionDetails>
                    {fetchingHistory ? (
                        <StyledLoadingContainer>
                            <CircularProgress />
                        </StyledLoadingContainer>
                    ) : errorHistory ? (
                        <Box color="error.main" p={2} width="100%">
                            {errorHistory}
                        </Box>
                    ) : (
                        <StyledTableContainer>
                            <Table
                                module="claim"
                                headers={headers}
                                itemFormatters={itemFormatters}
                                items={history || []}
                                withPagination={false}
                                withPaper={false}
                                sort={null}
                                onDoubleClick={onViewVersion}
                                rowStyle={(item, index) => ({
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                    }
                                })}
                            />
                        </StyledTableContainer>
                    )}
                </AccordionDetails>
            </StyledAccordion>
        </StyledPaper>
    );
};

export default withModulesManager(ClaimHistoryPanel);