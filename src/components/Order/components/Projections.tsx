import React from 'react';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faArrowsAltH } from '@fortawesome/free-solid-svg-icons/faArrowsAltH';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';

import State from 'src/entities/State';
import Projection from 'src/entities/Projection';

import { getOrderCells } from 'src/redux/selectors';
import {
  projectionAddAction,
  projectionUpAction,
  projectionDownAction,
  projectionRemoveAction
} from 'src/redux/actions';

interface ProjectionsProps extends ProjectionsState, ProjectionsDispatch {}

interface ProjectionsState {
  orderCells: string[];
  projections: Projection[];
}

interface ProjectionsDispatch {
  onProjectionAdd: (cell: string) => void;
  onProjectionUp: (n: number) => void;
  onProjectionDown: (n: number) => void;
  onProjectionRemove: (n: number) => void;
}

const Projections: React.FC<ProjectionsProps> = (props: ProjectionsProps) => {
  const [header, setHeader] = React.useState('');
  const disableds = props.orderCells.map(o => props.projections.find(p => p.name === o) !== undefined);

  const onHeaderAdd = () => {
    if (header.trim() === '') return;
    props.onProjectionAdd(header.trim());
    setHeader('');
  };

  return (
    <div className="flex justify-center">
      <div className="w-full">
        <h2>Cellules Commandes</h2>
        <ul className="border rounded h-64 overflow-y-auto">
          {props.orderCells.map((cell, index) => (
            <li key={index} className="px-5 py-2 border-b last:border-b-0 flex justify-between items-center">
              {cell}

              <button
                onClick={() => props.onProjectionAdd(cell)}
                className={`bg-green-500 text-white px-5 py-2 rounded ${disableds[index] && 'opacity-50 cursor-not-allowed'}`}
                disabled={disableds[index]}
              >
                <FontAwesomeIcon icon={faArrowRight} size="xs" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-5 flex items-center justify-center">
        <FontAwesomeIcon icon={faArrowsAltH} size="10x" />
      </div>

      <div className="w-full">
        <h2>Cellules Export</h2>
        <ul className="border rounded h-64 overflow-y-auto">
          {props.projections.map((projection, index) => (
            <li key={index} className="px-5 py-2 border-b last:border-b-0 flex justify-between items-center">
              {projection.name}

              <div>
                <button
                  onClick={() => props.onProjectionUp(index)}
                  className={`bg-gray-900 text-white px-5 py-2 rounded ${index === 0 && 'opacity-50 cursor-not-allowed'}`}
                  disabled={index === 0}
                >
                  <FontAwesomeIcon icon={faArrowUp} size="xs" />
                </button>
                <button
                  onClick={() => props.onProjectionDown(index)}
                  className={`bg-gray-900 text-white px-5 py-2 rounded ${index === props.projections.length - 1 && 'opacity-50 cursor-not-allowed'}`}
                  disabled={index === props.projections.length - 1}
                >
                  <FontAwesomeIcon icon={faArrowDown} size="xs" />
                </button>
                <button
                  onClick={() => props.onProjectionRemove(index)}
                  className="bg-red-700 text-white px-5 py-2 rounded"
                >
                  <FontAwesomeIcon icon={faTrash} size="xs" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-2">
          <input
            value={header}
            onChange={e => setHeader(e.currentTarget.value)}
            type="text"
            className="border rounded px-5 py-2"
          />
          <button onClick={onHeaderAdd} className="bg-green-600 text-white px-5 py-2 rounded">
            <FontAwesomeIcon icon={faPlus} size="xs" />
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: State): ProjectionsState => ({
  orderCells: getOrderCells(state),
  projections: state.projections
})

const mapDispatchToProps = (dispatch: Function): ProjectionsDispatch => ({
  onProjectionAdd: cell => dispatch(projectionAddAction(cell)),
  onProjectionUp: index => dispatch(projectionUpAction(index)),
  onProjectionDown: index => dispatch(projectionDownAction(index)),
  onProjectionRemove: index => dispatch(projectionRemoveAction(index))
});

export default connect(mapStateToProps, mapDispatchToProps)(Projections);
