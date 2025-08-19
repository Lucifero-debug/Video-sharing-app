import React, { useEffect, useState } from 'react'
import styled from "styled-components"
import Card from '../components/Card';
import axios from "axios";
import { useSelector } from "react-redux";

const Container = styled.div `
display: flex;
justify-content: space-between;
flex-wrap: wrap;
`
function Playlist() {

const [videos,setVideos]=useState([]);
const { currentUser } = useSelector(state => state.user);
    
useEffect(()=>{
const fetchVideos=async()=>{
    const res=await axios.get(`/api/v1/playlist/${currentUser._id}/get`)
    setVideos(res.data.data)
    // console.log("playlist videos are:",res.data.data)
    // console.log("Tags are:",tags[0])
};
fetchVideos();
},[currentUser]);

  return (
    <>
    <Container>
      {videos.map(video=>(
        <Card key={video._id} video={video}/>
      ))}
    </Container>
    </>
  )
}

export default Playlist
