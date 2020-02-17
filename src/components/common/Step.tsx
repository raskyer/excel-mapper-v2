import React from 'react';
import { connect } from 'react-redux';

import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Badge from 'react-bootstrap/Badge';

import State from '../../entities/State';
import Status from '../../entities/Status';
import { eventKeyToggledAction } from '../../redux/actions';

interface StepProps extends StepState, StepDispatch {
  eventKey: string;
  title: string;
  state?: Status;
  children?: React.ReactNode
}

interface StepState {
  activeKeys: Set<string>;
}

interface StepDispatch {
  onEventKeyToggle: (s: string) => void;
}

const Step: React.FC<StepProps> = (props: StepProps) => {
  let wording;
  switch (props.state) {
    case 'success':
      wording = 'Valide';
      break;
    case 'warning':
      wording = 'Attention';
      break;
    case 'danger':
      wording = 'Invalide';
      break;
    default:
      wording = 'Manquant';
      break;
  }

  return (
    <Card>
      <Accordion.Toggle as={Card.Header} eventKey={props.eventKey} onClick={() => props.onEventKeyToggle(props.eventKey)}>
        {props.title} <Badge pill variant={props.state}>{wording}</Badge>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={props.activeKeys.has(props.eventKey) ? '0' : props.eventKey}>
        <Card.Body>
          {props.children}
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};

Step.defaultProps = {
  state: 'dark'
};

const mapStateToProps = (state: State): StepState => ({
  activeKeys: state.activeKeys
});

const mapDispatchToProps = (dispatch: Function): StepDispatch => ({
  onEventKeyToggle: (s: string) => dispatch(eventKeyToggledAction(s))
});

export default connect(mapStateToProps, mapDispatchToProps)(Step);
