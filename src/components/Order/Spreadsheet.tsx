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

import State from 'src/entities/State';
import { getOrderSheet } from 'src/redux/selectors';
import {
  orderCustomerIDCellChangedAction,
  orderProviderIDCellChangedAction,
  orderTypeCellChangedAction,
  orderLoadingDateCellChangedAction,
  orderShippingDateCellChangedAction
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
  orderSheet: any[][]; // to be replaced by the projected sheet
  orderCustomerIDCell?: number;
  orderProviderIDCell?: number;
  orderTypeCell?: number;
  orderLoadingDateCell?: number;
  orderShippingDateCell?: number;
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

  return (
    <HotTable
      colHeaders={false}
      rowHeaders={false}
      minSpareRows={1}
      data={props.orderSheet}
      colWidths="100"
      width="100%"
      height="100%"
      licenseKey="non-commercial-and-evaluation"
      contextMenu={contextMenu}
      cells={(row, col) => {
        if (row === 0) {
          return { renderer: headerRender(props, col) };
        }
        return { renderer: columnRender(props, col) };
      }}
    />
  );
};

const mapStateToProps = (state: State): SpreadsheetState => ({
  orderSheet: getOrderSheet(state),
  orderCustomerIDCell: state.orderCustomerIDCell,
  orderProviderIDCell: state.orderProviderIDCell,
  orderTypeCell: state.orderTypeCell,
  orderLoadingDateCell: state.orderLoadingDateCell,
  orderShippingDateCell: state.orderShippingDateCell
});

const mapDispatchToProps = (dispatch: Function): SpreadsheetDispatch => ({
  onCustomerIDCellChange: (s) => dispatch(orderCustomerIDCellChangedAction(s)),
  onProviderIDCellChange: (s) => dispatch(orderProviderIDCellChangedAction(s)),
  onTypeCellChange: (s) => dispatch(orderTypeCellChangedAction(s)),
  onLoadingDateCellChange: (s) => dispatch(orderLoadingDateCellChangedAction(s)),
  onShippingDateCellChange: (s) => dispatch(orderShippingDateCellChangedAction(s))
});

export default connect(mapStateToProps, mapDispatchToProps)(Spreadsheet);
