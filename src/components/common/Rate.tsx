import React from 'react';

interface RateProps {
  label: string;
  value: number;
  onChange: (n: number) => void;
}

const Rate: React.FC<RateProps> = (props: RateProps) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.currentTarget.value, 10);
    props.onChange(isNaN(value) ? 0 : value);
  };
  
  return (
    <div className="w-full pr-10">
      <label htmlFor="grid-first-name" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
        {props.label}
      </label>
      
      <input
        id="grid-first-name"
        type="number"
        value={props.value}
        onChange={onChange}
        min={0}
        className="appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 mb-3 leading-tight"
      />
    </div>
  );
};

export default Rate;
