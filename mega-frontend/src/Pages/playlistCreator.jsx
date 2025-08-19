import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import PropTypes from 'prop-types';
import axios from "axios";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../firebase";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 600px;
  background-color: ${({theme})=>theme.bgLighter};
  color: ${({theme})=>theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;

const Close = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const Input = styled.input`
  color: ${({theme})=>theme.text};
  border: 1px solid ${({theme})=>theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Description = styled.textarea`
  color: ${({theme})=>theme.text};
  border: 1px solid ${({theme})=>theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({theme})=>theme.soft};
  color: ${({theme})=>theme.textSoft};
  &:hover {
    cursor: pointer;
  }
  &:active {
    transform: scale(1.07);
  }
`;

const Label = styled.label`
  font-size: 14px;
`;

function PlaylistCreator({ setOpen }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(undefined);

  const uploadFileToFirebase = async (file) => {
    try {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log("error is:", error);
        },
      );

      await uploadTask;

      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file to Firebase Storage:', error);
      throw error;
    }
  };

  const handleUpload = async (e) => {
    try {
        e.preventDefault();
        
        const thumbnailURL=await uploadFileToFirebase(thumbnail);
      console.log("thumbnail URL is:", thumbnailURL);
      await axios.post("/api/v1/playlist/create", { name: title, description: description, thumbnail: thumbnailURL });
      // navigate('/playlist')
      setOpen(false)
    } catch (error) {
      console.log("Error while creating Playlist", error);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Close onClick={() => setOpen(false)}>X</Close>
        <Input type="text" placeholder="Title" name="title" onChange={(e) => setTitle(e.target.value)} />
        <Description type="text" placeholder="Description" name="description" rows={4} onChange={(e) => setDescription(e.target.value)} />
        <Label>Thumbnail:</Label>
        <Input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} />
        <Button onClick={handleUpload}>Upload</Button>
      </Wrapper>
    </Container>
  );
}

PlaylistCreator.propTypes = {
  setOpen: PropTypes.func
};

export default PlaylistCreator;
