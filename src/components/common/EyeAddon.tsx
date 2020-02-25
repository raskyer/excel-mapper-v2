import React from 'react';

import Button from 'react-bootstrap/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';

interface EyeAddonProps {
  onClick: () => void;
  disabled: boolean;
}

const EyeAddon: React.FC<EyeAddonProps> = (props: EyeAddonProps) => (
  <Button
    variant="dark"
    onClick={props.onClick}
    disabled={props.disabled}
    title="Verifier"
  >
    <FontAwesomeIcon icon={faEye} size="xs" />
  </Button>
);

export default EyeAddon;
