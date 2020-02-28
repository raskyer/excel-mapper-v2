import React from 'react';

interface SectionProps {
  title: string;
  children?: React.ReactNode;
}

const Section: React.FC<SectionProps> = (props: SectionProps) => {
  return (
    <section className="bg-white rounded shadow-md m-5 p-5">
      <h1 className="font-bold text-xl mb-5 text-gray-700 border-b-2">
        {props.title}
      </h1>
      {props.children}
    </section>
  );
};

export default Section;
