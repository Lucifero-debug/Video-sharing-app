import React, { useEffect, useState } from 'react'
import styled from "styled-components"
import Displayer from '../components/Displayer';
import axios from "axios";
import { useSelector } from "react-redux";
import PlaylistCreator from './playlistCreator';

const Container = styled.div `
display: flex;
flex-direction: column;
justify-content: space-between;
flex-wrap: wrap;
gap: 10px;
`

const Button=styled.div`
border-radius: 3px;
border: none;
padding: 10px 20px;
font-weight: 500;
text-align: center;
cursor: pointer;
background-color: ${({theme})=>theme.soft};
color: ${({theme})=>theme.textSoft};
&:hover{
    cursor: pointer;
}
&:active{
  transform: scale(1.08);
}
`

function ListPlaylist() {

const [playlist,setPlaylist]=useState([]);
const { currentUser } = useSelector(state => state.user);
const [open,setOpen]=useState(false);
    
useEffect(()=>{
const fetchPlaylists=async()=>{
    const res=await axios.get(`/api/v1/playlist/${currentUser._id}/get`)
    setPlaylist(res.data.data)
    // console.log("playlist are:",res.data.data)
    // console.log("Tags are:",tags[0])
};
fetchPlaylists();
},[currentUser]);

  return (
    <>
   {currentUser &&  <Container>
<Button onClick={()=>setOpen(true)}>Create A New Playlist</Button>
      {playlist.map(playlist=>(
        <Displayer key={playlist._id} playlist={playlist}/>
      ))}
      {open && <PlaylistCreator setOpen={setOpen}/>}
    </Container>}
    </>
  )
}

export default ListPlaylist
