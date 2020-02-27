import React from 'react';

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
    <section className="bg-white p-5 shadow-md rounded m-5">
      <h1 className="font-bold text-xl mb-5 text-gray-700 border-b-2">Import</h1>
      
      <form>
        <div>
          <label>Fichier <strong>Commandes</strong> :</label>
          <Dropzone onChange={onFileUpload} />
        </div>
      </form>
    </section>
  );
};

export default Upload;
