import React from 'react';

import Container from '@material-ui/core/Container';

import Dropzone from '../common/Dropzone';

interface UploadProps {
  title: string;
  onFileUpload: (file: File) => void;
}

const Upload: React.FC<UploadProps> = (props: UploadProps) => {
  const onFileUpload = (files: File[]) => {
    if (files.length < 1) return;
    props.onFileUpload(files[0]);
  };

  return (
    <Container>
      <form>
        <div>
          <label>Fichier <strong>{props.title}</strong> :</label>
          <Dropzone onChange={onFileUpload} />
        </div>
      </form>
    </Container>
  );
};

export default Upload;
