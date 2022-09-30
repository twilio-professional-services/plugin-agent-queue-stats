import TableCell from '@material-ui/core/TableCell';
import styled from "react-emotion";

export const AgentQueueStatsWrapper = styled('div')`
  overflow: auto;
`;

export const StatsTableCell = styled(TableCell)`
  font-size: 12px !important;
`

export const StatsKeyTableCell = styled(StatsTableCell)`
  font-weight: bold !important;
`