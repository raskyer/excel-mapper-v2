import React from 'react';
import { connect } from 'react-redux';

import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import State from 'src/entities/State';

import { getCustomerSheet, getProviderSheet } from 'src/redux/selectors';

interface ImportProps extends ImportState, ImportDispatch {}

interface ImportState {
  customerSheet: any[][];
  providerSheet: any[][];
}

interface ImportDispatch {}

const Import: React.FC<ImportProps> = (props: ImportProps) => {
  if (props.customerSheet.length < 1) return null;

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
  customerSheet: getCustomerSheet(state),
  providerSheet: getProviderSheet(state)
});

export default connect(mapStateToProps)(Import);
