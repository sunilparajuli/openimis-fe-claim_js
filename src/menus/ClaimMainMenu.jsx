import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Keyboard, ScreenShare, Assignment } from "@mui/icons-material";
import { formatMessage, MainMenuContribution, withModulesManager } from "@openimis/fe-core";
import { RIGHT_ADD, RIGHT_SUBMIT, RIGHT_CLAIMREVIEW, RIGHT_PROCESS } from "../constants";
const CLAIM_MAIN_MENU_CONTRIBUTION_KEY = "claim.MainMenu";

class ClaimMainMenu extends Component {
  render() {
    const { rights } = this.props;
    let entries = this.props.modulesManager
        .getContribs(CLAIM_MAIN_MENU_CONTRIBUTION_KEY)
        .filter((c) => !c.filter || c.filter(rights));

    if (!entries.length) return null;
    return (
      <MainMenuContribution
        {...this.props}
        header={formatMessage(this.props.intl, "claim", "mainMenu")}
        icon={<ScreenShare />}
        entries={entries}
        menuId="ClaimMainMenu"
      />
    );
  }
}

const mapStateToProps = (state) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
});
export { CLAIM_MAIN_MENU_CONTRIBUTION_KEY };
export default withModulesManager(injectIntl(connect(mapStateToProps)(ClaimMainMenu)));
