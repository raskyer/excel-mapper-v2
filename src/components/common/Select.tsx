import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import SelectUI from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

interface SelectProps {
  title: string;
  value?: string | number;
  onChange?: (s?: string) => void;
  options: string[];
  byValue?: boolean;
  addon?: React.ReactElement;
}

const Select: React.FC<SelectProps> = (props) => {
  const onChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>): void => {
    console.log(e);
    if (!props.onChange) return;
    //props.onChange(e.currentTarget.value);
  };

  return (
    <FormControl
      error={props.value === undefined}
      disabled={props.options.length < 1}
      required
      margin="dense"
      size="medium"
      style={{ minWidth: '200px' }}
    >
      <InputLabel>{props.title}</InputLabel>
      <SelectUI
        defaultValue={-1}
        value={props.value !== undefined ? props.value : -1}
        onChange={onChange}
        disabled={props.options.length < 1}
        required
      >
        <MenuItem disabled value={-1}>--- Choissir une option --</MenuItem>
        {props.options.map((option, index) => (
          <MenuItem key={index} value={props.byValue ? option : index}>{option}</MenuItem>
        ))}
      </SelectUI>
    </FormControl>
  );
};

export default Select;
