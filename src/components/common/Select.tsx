import React from 'react';

import Form from 'react-bootstrap/Form';

interface SelectProps {
  title: string;
  value?: string;
  onChange?: (s: string) => void;
  options: string[];
  byValue?: boolean;
}

const Select: React.FC<SelectProps> = (props) => {
  const onChange = (e: React.FormEvent<HTMLSelectElement>): void => {
    if (!props.onChange) return;
    props.onChange(e.currentTarget.value);
  };

  return (
    <Form.Group>
      <Form.Label>{props.title}</Form.Label>
      <Form.Control
        as="select"
        value={props.value}
        onChange={onChange}
        isValid={props.value !== undefined}
      >
        {props.options.map((option, index) => (
          <option key={index} value={props.byValue ? option : index + ''}>{option}</option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default Select;