import React from 'react';

interface SelectProps {
  title: string;
  value?: string | number;
  onChange?: (s?: string) => void;
  options: string[];
  byValue?: boolean;
  addon?: React.ReactElement;
}

const Select: React.FC<SelectProps> = (props) => {
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    if (!props.onChange) return;
    props.onChange(e.currentTarget.value);
  };

  return (
    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <label htmlFor={props.title} className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
        {props.title}
      </label>
      <div className="relative">
        <select
          id={props.title}
          value={props.value !== undefined ? props.value : -1}
          onChange={onChange}
          disabled={props.options.length < 1}
          required
          className={`block appearance-none w-full ${props.value === undefined ? 'bg-gray-200 border-red-600' : 'bg-white border-green-500'} border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
        >
          <option disabled value={-1}>--- Choissir une option --</option>
          {props.options.map((option, index) => (
            <option key={index} value={props.byValue ? option : index}>{option}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  );
};

export default Select;
