import React from 'react';

interface ProgressBarProps {
  percent: number;
}

const ProgressBar: React.FC<ProgressBarProps> = (props: ProgressBarProps) => {
  let color = 'bg-red-500';
  if (props.percent > 75) {
    color = 'bg-green-500';
  } else if (props.percent > 45) {
    color = 'bg-yellow-500';
  }

  return (
    <div className="shadow w-full bg-gray-300 mt-2">
      <div 
        className={`${color} text-xs leading-none py-1 text-center text-white font-bold`}
        style={{ width: `${props.percent}%` }}
      >
        {props.percent}%
      </div>
    </div>
  );
};

export default ProgressBar;
