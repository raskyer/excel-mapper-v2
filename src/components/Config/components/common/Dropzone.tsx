import React, { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

const baseStyle: any = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  cursor: 'pointer'
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

interface DropzoneProps {
  onChange: (files: File[]) => void;
}

const Dropzone: React.FC<DropzoneProps> = (props: DropzoneProps) => {
  const {
    acceptedFiles,
    rejectedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({ accept: '.xlsx', onDropAccepted: props.onChange });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept || acceptedFiles.length > 0 ? acceptStyle : {}),
    ...(isDragReject || rejectedFiles.length > 0 ? rejectStyle : {})
  }), [
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
    rejectedFiles
  ]);

  return (
    <div {...getRootProps({ style })}>
      <input {...getInputProps()} />
      Faites glisser ou cliquez pour sélectionner un fichier
      <ul className="m-0">
        {acceptedFiles.map(f => <li key={f.name}>{f.name}</li>)}
      </ul>
    </div>
  );
};

export default Dropzone;
