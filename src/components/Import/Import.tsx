import React from 'react';
import { connect } from 'react-redux';

import Section from '../common/Section';
import Dropzone from '../common/Dropzone';
import Select from '../common/Select';
import Database from '../common/Database';

import State from 'src/entities/State';

import { getDbSheetNames, getCustomerCells, getProviderCells } from 'src/redux/selectors';
import {
  dbFileChangeAction,
  customerSheetChangeAction,
  providerSheetChangeAction,
  customerIDCellChangeAction,
  providerIDCellChangeAction,
  customerMarkCellChangeAction,
  providerMarkCellChangeAction
} from 'src/redux/actions';

interface ImportProps extends ImportState, ImportDispatch {}

interface ImportState {
  customerSheet: any[][];
  providerSheet: any[][];

  customerSheetName?: string;
  providerSheetName?: string;
  sheetNames: string[];

  customerIDCell?: number;
  providerIDCell?: number;
  customerMarkCell?: number;
  providerMarkCell?: number;
  customerCells: string[];
  providerCells: string[];
}

interface ImportDispatch {
  onFileUpload: (f: File) => void;
  onCustomerSheetChange: (s: string) => void;
  onProviderSheetChange: (s: string) => void;
  onCustomerIDChange: (n: number) => void;
  onProviderIDChange: (n: number) => void;
  onCustomerMarkChange: (n: number) => void;
  onProviderMarkChange: (n: number) => void;
}

const Import: React.FC<ImportProps> = (props: ImportProps) => {
  const onFileUpload = (f: File[]) => {
    if (f.length > 0) props.onFileUpload(f[0]);
  };

  return (
    <>
      <Section title="Import">
        <form>
          <div>
            <label>Fichier <strong>Clients / Transporteurs</strong> :</label>
            <Dropzone onChange={onFileUpload} />
          </div>

          <div className="flex justify-evenly mt-5">
            <Select
              title="Feuille Client"
              value={props.customerSheetName}
              options={props.sheetNames}
              onChange={props.onCustomerSheetChange}
              byValue
            />
            <Select
              title="Feuille Transporteur"
              value={props.providerSheetName}
              options={props.sheetNames}
              onChange={props.onProviderSheetChange}
              byValue
            />
          </div>

          <div className="flex justify-evenly mt-5">
            <Select
              title="Cellule ID Client"
              value={props.customerIDCell}
              onChange={props.onCustomerIDChange}
              options={props.customerCells}
            />
            <Select
              title="Cellule ID Transporteur"
              value={props.providerIDCell}
              onChange={props.onProviderIDChange}
              options={props.providerCells}
            />
          </div>

          <div className="flex justify-evenly mt-5">
            <Select
              title="Cellule note Client"
              value={props.customerMarkCell}
              onChange={props.onCustomerMarkChange}
              options={props.customerCells}
            />
            <Select
              title="Cellule note Transporteur"
              value={props.providerMarkCell}
              onChange={props.onProviderMarkChange}
              options={props.providerCells}
            />
          </div>
        </form>
      </Section>

      <Section title="Base de données">
        <Database title="Clients" sheet={props.customerSheet} />
        <Database title="Transporteurs" sheet={props.providerSheet} />
      </Section>
    </>
  );
};

const mapStateToProps = (state: State): ImportState => ({
  customerSheet: state.customerSheet,
  providerSheet: state.providerSheet,
  customerSheetName: state.customerSheetName,
  providerSheetName: state.providerSheetName,
  sheetNames: getDbSheetNames(state),
  customerIDCell: state.customerIDCell,
  providerIDCell: state.providerIDCell,
  customerMarkCell: state.customerMarkCell,
  providerMarkCell: state.providerMarkCell,
  customerCells: getCustomerCells(state),
  providerCells: getProviderCells(state)
});

const mapDispatchToProps = (dispatch: Function): ImportDispatch => ({
  onFileUpload: f => dispatch(dbFileChangeAction(f)),
  onCustomerSheetChange: s => dispatch(customerSheetChangeAction(s)),
  onProviderSheetChange: s => dispatch(providerSheetChangeAction(s)),
  onCustomerIDChange: n => dispatch(customerIDCellChangeAction(n)),
  onProviderIDChange: n => dispatch(providerIDCellChangeAction(n)),
  onCustomerMarkChange: n => dispatch(customerMarkCellChangeAction(n)),
  onProviderMarkChange: n => dispatch(providerMarkCellChangeAction(n))
});

export default connect(mapStateToProps, mapDispatchToProps)(Import);
