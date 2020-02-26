import React from 'react';
import { connect } from 'react-redux';

import Container from '@material-ui/core/Container';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { Button } from '@material-ui/core';

import Dropzone from '../common/Dropzone';
import Select from '../common/Select';

import State from 'src/entities/State';

import { getDbSheetNames, getCustomerCells, getProviderCells } from 'src/redux/selectors';
import { dbFileChangedAction } from 'src/redux/actions';

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

  if (props.customerSheet.length < 1) {
    return (
      <Container>
        <form>
          <div>
            <label>Fichier <strong>Clients / Transporteurs</strong> :</label>
            <Dropzone onChange={onFileUpload} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
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

          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
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

          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
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

          <div>
            <Button variant="contained" color="primary">Importer</Button>
          </div>
        </form>
      </Container>
    );
  }

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {props.customerSheet[0].map((header, index) => (
                <TableCell key={index}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.customerSheet.slice(1, props.customerSheet.length).map((row, index) => (
              <TableRow key={index}>
                {row.map((cell, index) => (
                  <TableCell key={index}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

const mapStateToProps = (state: State): ImportState => ({
  //customerSheet: getCustomerSheet(state),
  //providerSheet: getProviderSheet(state)
  customerSheet: [],
  providerSheet: [],
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
  onFileChange: (f: File) => dispatch(dbFileChangedAction(f))
});

export default connect(mapStateToProps, mapDispatchToProps)(Import);
