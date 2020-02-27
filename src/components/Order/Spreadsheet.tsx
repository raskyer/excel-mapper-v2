import React from 'react';
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux';

import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPortrait } from '@fortawesome/free-solid-svg-icons/faPortrait';
import { faTruck } from '@fortawesome/free-solid-svg-icons/faTruck';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';

import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import State from 'src/entities/State';
import RankedOrder from 'src/entities/RankedOrder';
import Projection from 'src/entities/Projection';

import { formatDate } from 'src/utils/core';

import { getRankedOrders } from 'src/redux/selectors';
import {
  orderCustomerIDCellChangeAction,
  orderProviderIDCellChangeAction,
  orderTypeCellChangeAction,
  orderLoadingDateCellChangeAction,
  orderShippingDateCellChangeAction
} from 'src/redux/actions';

const headerRender = (props: SpreadsheetProps, col: number): Handsontable.renderers.Base => function(this: any, _, td) {
  Handsontable.renderers.TextRenderer.apply(this, arguments as any);
  td.style.fontWeight = 'bold';
  
  let icon = '';
  switch (col) {
    case props.orderCustomerIDCell:
      icon = renderToString(<FontAwesomeIcon icon={faPortrait} color="blue" />) + ' ';
      break;
    case props.orderProviderIDCell:
      icon = renderToString(<FontAwesomeIcon icon={faTruck} color="red" />) + ' ';
      break;
    case props.orderTypeCell:
      icon = renderToString(<FontAwesomeIcon icon={faCog} color="grey" />) + ' ';
      break;
    case props.orderLoadingDateCell:
    case props.orderShippingDateCell:
      icon = renderToString(<FontAwesomeIcon icon={faClock} color="purple" />) + ' ';
      break;
  }
  td.innerHTML = icon + td.innerHTML;
};

const columnRender = (props: SpreadsheetProps, col: number): Handsontable.renderers.Base => function(this: any, _, td) {
  Handsontable.renderers.TextRenderer.apply(this, arguments as any);
  switch (col) {
    case props.orderCustomerIDCell:
      td.style.backgroundColor = 'blue';
      break;
    case props.orderProviderIDCell:
      td.style.backgroundColor = 'red';
      break;
    case props.orderTypeCell:
      td.style.backgroundColor = 'grey';
      break;
    case props.orderLoadingDateCell:
    case props.orderShippingDateCell:
      td.style.backgroundColor = 'purple';
      break;
  }
};

const extractCell = (selections: Handsontable.contextMenu.Selection[]): number => {
  if (selections.length > 1) {
    throw new Error();
  }
  const { start, end } = selections[0];
  if (start.row !== end.row) {
    throw new Error();
  }
  if (start.col !== end.col) {
    throw new Error();
  }
  return start.col;
}

interface SpreadsheetProps extends SpreadsheetState, SpreadsheetDispatch {}

interface SpreadsheetState {
  rankedOrders: RankedOrder[];
  projections: Projection[];
  orderCustomerIDCell?: number;
  orderProviderIDCell?: number;
  orderTypeCell?: number;
  orderLoadingDateCell?: number;
  orderShippingDateCell?: number;
  customerMarkRate: number;
  providerMarkRate: number;
  dateMarkRate: number;
}

interface SpreadsheetDispatch {
  onCustomerIDCellChange: (s: string) => void;
  onProviderIDCellChange: (s: string) => void;
  onTypeCellChange: (s: string) => void;
  onLoadingDateCellChange: (s: string) => void;
  onShippingDateCellChange: (s: string) => void;
}

const Spreadsheet: React.FC<SpreadsheetProps> = (props: SpreadsheetProps) => {
  const contextMenu: Handsontable.contextMenu.Settings = {
    items: {
      'copy' : {
        name: 'Copier'
      },
      '---------': {},
      customerIDCell: {
        name: 'Définir comme cellule d\'<strong>ID Client</strong>',
        callback: function(key, selections) {
          const cell = extractCell(selections);
          props.onCustomerIDCellChange(cell.toString());
        }
      },
      providerIDCell: {
        name: 'Définir comme cellule d\'<strong>ID Transporteur</strong>',
        callback: (_, selections) => {
          const cell = extractCell(selections);
          props.onProviderIDCellChange(cell.toString());
        }
      },
      'step2': { name: '---------' },
      typeCell: {
        name: 'Définir comme cellule de <strong>Type</strong>',
        callback: (_, selections) => {
          const cell = extractCell(selections);
          props.onTypeCellChange(cell.toString());
        }
      },
      dateLoadingCell: {
        name: 'Définir comme cellule de <strong>Date Chargement</strong>',
        callback: (_, selections) => {
          const cell = extractCell(selections);
          props.onLoadingDateCellChange(cell.toString());
        }
      },
      dateShippingCell: {
        name: 'Définir comme cellule de <strong>Date Livraison</strong>',
        callback: (_, selections) => {
          const cell = extractCell(selections);
          props.onShippingDateCellChange(cell.toString());
        }
      }
    }
  };

  const data: any[][] = [];
  props.rankedOrders.forEach(o => {
    if (o.projection !== undefined) {
      data.push(o.projection);
    }
  });
  data.unshift(props.projections.map(p => p.name));

  const [anchorEl, setAnchorEl] = React.useState<HTMLTableCellElement | null>(null);
  const [ro, setRo] = React.useState<RankedOrder | undefined>(undefined);

  return (
    <>
      <HotTable
        colHeaders={false}
        rowHeaders={false}
        minSpareRows={1}
        data={data}
        width="100%"
        height="100%"
        licenseKey="non-commercial-and-evaluation"
        contextMenu={contextMenu}
        selectionMode="single"
        afterOnCellMouseUp={(event, coords, td) => {
          const { row } = coords;
          if (props.rankedOrders[row - 1] !== undefined) {
            setRo(props.rankedOrders[row - 1]);
            setAnchorEl(td);
          }
        }}
        cells={(row, col) => {
          if (row === 0) {
            return { renderer: headerRender(props, col) };
          }
          return { renderer: columnRender(props, col) };
        }}
      />

      <Popper id={'simple-popper'} open={Boolean(anchorEl)} anchorEl={anchorEl}>
        <Paper>
          {ro && (
            <Typography>
              <b>Client</b> : {ro.customer.id}, <b>Note</b> : {ro.customer.mark ? ro.customer.mark : 'Non trouvé'} ({ro.customer.ranking}/{5 * props.customerMarkRate}),<br/>
              <b>Transporteur</b> : {ro.provider.id}, <b>Note</b> : {ro.provider.mark ? ro.provider.mark : 'Non trouvé'} ({ro.provider.ranking}/{5 * props.providerMarkRate}),<br/>
              <b>Date</b> : {formatDate(ro.date.date)}, <b>Note</b> : {ro.date.ranking.toFixed(2)}/{5 * props.dateMarkRate}
            </Typography>
          )}
        </Paper>
      </Popper>
    </>
  );
};

const mapStateToProps = (state: State): SpreadsheetState => ({
  rankedOrders: getRankedOrders(state),
  projections: state.projections,
  orderCustomerIDCell: state.orderCustomerIDCell,
  orderProviderIDCell: state.orderProviderIDCell,
  orderTypeCell: state.orderTypeCell,
  orderLoadingDateCell: state.orderLoadingDateCell,
  orderShippingDateCell: state.orderShippingDateCell,
  customerMarkRate: state.customerMarkRate,
  providerMarkRate: state.providerMarkRate,
  dateMarkRate: state.dateMarkRate
});

const mapDispatchToProps = (dispatch: Function): SpreadsheetDispatch => ({
  onCustomerIDCellChange: (s) => dispatch(orderCustomerIDCellChangeAction(s)),
  onProviderIDCellChange: (s) => dispatch(orderProviderIDCellChangeAction(s)),
  onTypeCellChange: (s) => dispatch(orderTypeCellChangeAction(s)),
  onLoadingDateCellChange: (s) => dispatch(orderLoadingDateCellChangeAction(s)),
  onShippingDateCellChange: (s) => dispatch(orderShippingDateCellChangeAction(s))
});

export default connect(mapStateToProps, mapDispatchToProps)(Spreadsheet);
