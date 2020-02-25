import React from 'react';
import { renderToString } from 'react-dom/server'

import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';

interface SpreadsheetProps {
  sheet: any[][]; // to be replaced by the projected sheet
  orderCustomerIDCell?: number;
  orderProviderIDCell?: number;
  orderTypeCell?: number;
  orderDateLoadingCell?: number;
  orderDateShippingCell?: number;
}

const Spreadsheet: React.FC<SpreadsheetProps> = (props: SpreadsheetProps) => {
  const contextMenu = {
    items: {
      customerIDCell: {
        name: 'Définir comme cellule d\'<strong>ID Client</strong>',
        callback: function(key: any, selection: any) {
          console.log(selection);
        }
      },
      providerIDCell: {
        name: 'Définir comme cellule d\'<strong>ID Transporteur</strong>',
        callback: () => {
        }
      },
      typeCell: {
        name: 'Définir comme cellule de <strong>Type</strong>',
        callback: () => {
        }
      },
      dateLoadingCell: {
        name: 'Définir comme cellule de <strong>Date Chargement</strong>',
        callback: () => {
        }
      },
      dateShippingCell: {
        name: 'Définir comme cellule de <strong>Date Livraison</strong>',
        callback: () => {
        }
      }
    }
  };

  /*const columns = useMemo(() => props.projections.map(projection => ({
    data: projection.name,
    type: projection.type
  })), [props.projections]);*/

  return (
    <HotTable
      colHeaders={false}
      rowHeaders={false}
      minSpareRows={1}
      data={props.sheet}
      colWidths="100"
      width="100%"
      height="100%"
      licenseKey="non-commercial-and-evaluation"
      contextMenu={contextMenu}
      cells={(row, col) => {
        if (row === 0) {
          return {
            renderer: function(this: any, _: any, td) {
              Handsontable.renderers.TextRenderer.apply(this, arguments as any);
              td.style.fontWeight = 'bold';
              if (col === 1) {
                td.innerHTML = renderToString(<FontAwesomeIcon icon={faStar} style={{ color: 'yellow' }} />) + td.innerHTML;
              }
            }
          };
        }
        return {};
      }}
    />
  );
};

export default Spreadsheet;
