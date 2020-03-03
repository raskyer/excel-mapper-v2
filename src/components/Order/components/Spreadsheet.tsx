import React from 'react';
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux';
import { createPopper } from '@popperjs/core';

import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPortrait } from '@fortawesome/free-solid-svg-icons/faPortrait';
import { faTruck } from '@fortawesome/free-solid-svg-icons/faTruck';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';

import State from 'src/entities/State';
import RankedOrder from 'src/entities/RankedOrder';
import Projection from 'src/entities/Projection';

import { getRankedOrders } from 'src/redux/selectors';
import {
  orderCustomerIDCellChangeAction,
  orderProviderIDCellChangeAction,
  orderTypeCellChangeAction,
  orderLoadingDateCellChangeAction,
  orderShippingDateCellChangeAction
} from 'src/redux/actions';

import { createWorkBook } from 'src/services/DefaultLibraryAdaptor';
import { formatDate } from 'src/utils/core';

const headerRender = (props: SpreadsheetProps, col: number): Handsontable.renderers.Base => function(this: any, _, td) {
  Handsontable.renderers.TextRenderer.apply(this, arguments as any);
  td.style.fontWeight = 'bold';

  let icon = '';
  switch (props.projections[col].index) {
    case props.orderCustomerIDCell:
      icon = renderToString(<FontAwesomeIcon icon={faPortrait} className="text-blue-600" />) + ' ';
      break;
    case props.orderProviderIDCell:
      icon = renderToString(<FontAwesomeIcon icon={faTruck} className="text-red-600" />) + ' ';
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
  switch (props.projections[col].index) {
    case props.orderCustomerIDCell:
      td.style.color = '#fff';
      td.style.backgroundColor = '#4299e1';
      break;
    case props.orderProviderIDCell:
      td.style.color = '#fff';
      td.style.backgroundColor = 'red';
      break;
    case props.orderTypeCell:
      td.style.color = '#fff';
      td.style.backgroundColor = 'grey';
      break;
    case props.orderLoadingDateCell:
    case props.orderShippingDateCell:
      td.style.color = '#fff';
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
  onCustomerIDCellChange: (n: number) => void;
  onProviderIDCellChange: (n: number) => void;
  onTypeCellChange: (n: number) => void;
  onLoadingDateCellChange: (n: number) => void;
  onShippingDateCellChange: (n: number) => void;
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
          props.onCustomerIDCellChange(cell);
        }
      },
      providerIDCell: {
        name: 'Définir comme cellule d\'<strong>ID Transporteur</strong>',
        callback: (_, selections) => {
          const cell = extractCell(selections);
          props.onProviderIDCellChange(cell);
        }
      },
      'step2': { name: '---------' },
      typeCell: {
        name: 'Définir comme cellule de <strong>Type</strong>',
        callback: (_, selections) => {
          const cell = extractCell(selections);
          props.onTypeCellChange(cell);
        }
      },
      dateLoadingCell: {
        name: 'Définir comme cellule de <strong>Date Chargement</strong>',
        callback: (_, selections) => {
          const cell = extractCell(selections);
          props.onLoadingDateCellChange(cell);
        }
      },
      dateShippingCell: {
        name: 'Définir comme cellule de <strong>Date Livraison</strong>',
        callback: (_, selections) => {
          const cell = extractCell(selections);
          props.onShippingDateCellChange(cell);
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

  const [ro, setRo] = React.useState<RankedOrder | undefined>(undefined);
  const tooltip = React.useRef<HTMLDivElement>(null);

  const onDownload = () => {
    const fileName = prompt('Nom du fichier ?', 'out');

    if (fileName === null || fileName === '') {
      return;
    }

    const headers = props.projections.map(p => p.name);
    createWorkBook(headers, props.rankedOrders).download(fileName);
  };

  return (
    <>
      <HotTable
        className="m-5"
        colHeaders={false}
        rowHeaders={false}
        data={data}
        readOnly={true}
        height="400px"
        licenseKey="non-commercial-and-evaluation"
        contextMenu={contextMenu}
        selectionMode="single"
        afterOnCellMouseUp={(event, coords, td) => {
          const { row } = coords;
          const newRo = props.rankedOrders[row - 1];
          if (newRo !== undefined && tooltip.current !== null) {
            setRo(newRo);
            createPopper(td, tooltip.current);
          }
        }}
        cells={(row, col) => {
          if (row === 0) {
            return { renderer: headerRender(props, col) };
          }
          return { renderer: columnRender(props, col) };
        }}
      />

      <div className="m-5">
        <button
          onClick={onDownload}
          className="w-full font-bold bg-green-500 hover:bg-green-400 text-white border rounded px-5 py-2"
        >
          Télécharger
        </button>
      </div>

      <div
        ref={tooltip}
        onClick={() => setRo(undefined)}
        className={'bg-white shadow px-5 py-2 ' + (ro === undefined ? 'hidden' : '')}
      >
        <b>Note global</b> : {ro?.ranking.toFixed(2)} <br/>
        <b>Client</b> : {ro?.customer.id}, <b>Note</b> : {ro?.customer.mark ? ro?.customer.mark : 'Non trouvé'} ({ro?.customer.ranking}/{5 * props.customerMarkRate}),<br/>
        <b>Transporteur</b> : {ro?.provider.id}, <b>Note</b> : {ro?.provider.mark ? ro?.provider.mark : 'Non trouvé'} ({ro?.provider.ranking}/{5 * props.providerMarkRate}),<br/>
        <b>Date</b> : {formatDate(ro?.date.date)}, <b>Note</b> : {ro?.date.ranking.toFixed(2)}/{5 * props.dateMarkRate}
      </div>
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
  onCustomerIDCellChange: cell => dispatch(orderCustomerIDCellChangeAction(cell)),
  onProviderIDCellChange: cell => dispatch(orderProviderIDCellChangeAction(cell)),
  onTypeCellChange: cell => dispatch(orderTypeCellChangeAction(cell)),
  onLoadingDateCellChange: cell => dispatch(orderLoadingDateCellChangeAction(cell)),
  onShippingDateCellChange: cell => dispatch(orderShippingDateCellChangeAction(cell))
});

export default connect(mapStateToProps, mapDispatchToProps)(Spreadsheet);
