import React from 'react';

import Sheets from './Sheets';
import IDMapping from './IDMapping';

interface MappingProps extends MappingState, MappingDispatch {}

interface MappingState {
}

interface MappingDispatch {
}

const Mapping: React.FC<MappingProps> = (props: MappingProps) => {
  return (
    <>
      <Sheets />
      <IDMapping />
    </>
  );
};

export default Mapping;
