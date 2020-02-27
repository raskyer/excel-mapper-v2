import React from 'react';
import { connect } from 'react-redux';

import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Badge from 'react-bootstrap/Badge';

import State from 'src/entities/State';
import Status from 'src/entities/Status';

import { eventKeyToggleAction } from 'src/redux/actions';

interface StepProps extends StepState, StepDispatch {
  eventKey: string;
  title: string;
  status?: Status;
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
  switch (props.status) {
    case 'success':
      wording = 'Valide';
      break;
    case 'warning':
      wording = 'Incomplet';
      break;
    case 'danger':
      wording = 'Erreur';
      break;
    case 'secondary':
      wording = 'Non renseigné';
      break;
    case 'dark':
      wording = 'Inaccessible';
      break;
  }

  const onClick = () => {
    if (props.status === 'dark') return;
    props.onEventKeyToggle(props.eventKey);
  };

  return (
    <Card>
      <Accordion.Toggle as={Card.Header} eventKey={props.eventKey} onClick={onClick}>
        {props.eventKey}. {props.title} <Badge pill variant={props.status}>{wording}</Badge>
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
  status: 'dark'
};

const mapStateToProps = (state: State): StepState => ({
  activeKeys: state.activeKeys
});

const mapDispatchToProps = (dispatch: Function): StepDispatch => ({
  onEventKeyToggle: (s: string) => dispatch(eventKeyToggleAction(s))
});

export default connect(mapStateToProps, mapDispatchToProps)(Step);
