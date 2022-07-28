import * as Flex from '@twilio/flex-ui';
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux';
import { AppState, namespace } from "../../states";
import { Actions } from '../../states/QueueStatsState'
import AgentQueueStatsComponent from "./AgentQueueStatsComponent";

const mapStateToProps = (state: AppState) => ({
  agentQueueStats: state[namespace].stats
});

const mapDispatchToProps = (dispatch: Dispatch<Flex.ITask>) => ({
  updateStats: bindActionCreators(Actions.updateStats, dispatch),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type ContainerProps = ConnectedProps<typeof connector>;

export default connector(AgentQueueStatsComponent);