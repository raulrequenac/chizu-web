import React, { useState } from 'react'
import { handleUpload } from '../services/ChizuServices'

const Register = () => {
  const [imageUrl, setImageUrl] = useState('')

  const handleFileUpload = (event) => {
    console.log("The file to be uploaded is: ", event.target.files[0]);

    const uploadData = new FormData();
    uploadData.append("image", event.target.files[0]);
    
    handleUpload(uploadData)
    .then(response => {
        setImageUrl(response.secure_url)
      })
      .catch(error => {
        console.log("Error while uploading the file: ", error);
      });
  }

  return (
    <div className="Register">

    </div>
  )
}

export default Register
