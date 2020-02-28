import React from 'react';
import { connect } from 'react-redux';

import Section from 'src/components/common/Section';
import Dropzone from 'src/components/common/Dropzone';
import Select from 'src/components/common/Select';

import State from 'src/entities/State';

import { orderFileChangeAction } from 'src/redux/actions';
import { getOrderSheetNames, getOrderCells } from 'src/redux/selectors';

interface UploadProps extends UploadState, UploadDispatch {}

interface UploadState {
  orderSheetName?: string;
  orderSheetNames: string[];

  orderCustomerIDCell?: number;
  orderProviderIDCell?: number;
  orderTypeCell?: number;
  orderLoadingDateCell?: number;
  orderShippingDateCell?: number;
  orderCells: string[];
}

interface UploadDispatch {
  onFileUpload: (file: File) => void;
}

const Upload: React.FC<UploadProps> = (props: UploadProps) => {
  const onFileUpload = (files: File[]) => {
    if (files.length < 1) return;
    props.onFileUpload(files[0]);
  };

  return (
    <Section title="Import">
      <form>
        <div>
          <label>Fichier <strong>Commandes</strong> :</label>
          <Dropzone onChange={onFileUpload} />
        </div>

        <div className="flex justify-evenly mt-5">
            <Select
              title="Feuille Commandes"
              value={props.orderSheetName}
              options={props.orderSheetNames}
              byValue
            />
          </div>

          <div className="flex justify-evenly mt-5">
            <Select
              title="Cellule ID Client"
              value={props.orderCustomerIDCell}
              options={props.orderCells}
            />
            <Select
              title="Cellule ID Transporteur"
              value={props.orderProviderIDCell}
              options={props.orderCells}
            />
          </div>

          <div className="flex justify-evenly mt-5">
            <Select
              title="Cellule de Type"
              value={props.orderTypeCell}
              options={props.orderCells}
            />
            <Select
              title="Cellule date Chargement"
              value={props.orderLoadingDateCell}
              options={props.orderCells}
            />
            <Select
              title="Cellule date Livraison"
              value={props.orderShippingDateCell}
              options={props.orderCells}
            />
          </div>
      </form>
    </Section>
  );
};

const mapStateToProps = (state: State): UploadState => ({
  orderSheetName: state.orderSheetName,
  orderSheetNames: getOrderSheetNames(state),
  orderCustomerIDCell: state.orderCustomerIDCell,
  orderProviderIDCell: state.orderProviderIDCell,
  orderTypeCell: state.orderTypeCell,
  orderLoadingDateCell: state.orderLoadingDateCell,
  orderShippingDateCell: state.orderShippingDateCell,
  orderCells: getOrderCells(state)
});

const mapDispatchToProps = (dispatch: Function): UploadDispatch => ({
  onFileUpload: f => dispatch(orderFileChangeAction(f))
});

export default connect(mapStateToProps, mapDispatchToProps)(Upload);
