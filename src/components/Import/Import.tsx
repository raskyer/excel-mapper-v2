import React from 'react';
import { connect } from 'react-redux';

import Dropzone from '../common/Dropzone';
import Select from '../common/Select';

import State from 'src/entities/State';

import { getDbSheetNames, getCustomerCells, getProviderCells } from 'src/redux/selectors';
import { dbFileChangeAction } from 'src/redux/actions';
import Database from '../common/Database';

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
  onFileChange: (f: File) => void;
}

const Import: React.FC<ImportProps> = (props: ImportProps) => {
  const onFileUpload = (f: File[]) => {
    if (f.length > 0) props.onFileChange(f[0]);
  };

  return (
    <>
      <section className="bg-white p-5 shadow-md rounded m-5">
        <h1 className="font-bold text-xl mb-5 text-gray-700 border-b-2">Import</h1>

        <form>
          <div className="px-20">
            <label>Fichier <strong>Clients / Transporteurs</strong> :</label>
            <Dropzone onChange={onFileUpload} />
          </div>

          <div className="flex justify-evenly mt-5">
            <Select
              title="Feuille Client"
              value={props.customerSheetName}
              options={props.sheetNames}
              byValue
            />
            <Select
              title="Feuille Transporteur"
              value={props.providerSheetName}
              options={props.sheetNames}
              byValue
            />
          </div>

          <div className="flex justify-evenly mt-5">
            <Select
              title="Cellule ID Client"
              value={props.customerIDCell}
              options={props.customerCells}
            />
            <Select
              title="Cellule ID Transporteur"
              value={props.providerIDCell}
              options={props.providerCells}
            />
          </div>

          <div className="flex justify-evenly mt-5">
            <Select
              title="Cellule note Client"
              value={props.customerMarkCell}
              options={props.customerCells}
            />
            <Select
              title="Cellule note Transporteur"
              value={props.providerMarkCell}
              options={props.providerCells}
            />
          </div>
        </form>
      </section>

      <section className="mt-5 bg-white p-5 shadow-md rounded m-5">
        <h1 className="font-bold text-xl mb-5 text-gray-700 border-b-2">Base de données</h1>

        <Database title="Client" sheet={props.customerSheet} />
        <Database title="Transporteur" sheet={props.providerSheet} />
      </section>
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
  onFileChange: (f: File) => dispatch(dbFileChangeAction(f))
});

export default connect(mapStateToProps, mapDispatchToProps)(Import);
