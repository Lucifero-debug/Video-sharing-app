import React, { useEffect, useState } from 'react'
import styled from "styled-components"
import Card from '../components/Card';
import axios from "axios";
import {useSelector} from "react-redux"


const Container = styled.div `
display: flex;
justify-content: space-between;
flex-wrap: wrap;
`
function History() {

  const {currentUser}=useSelector((state)=>state.user)
const [videos,setVideos]=useState([]);
    
useEffect(()=>{
const fetchVideos=async()=>{
    const res=await axios.get(`/api/v1/users/history`)
    setVideos(res.data.data)
    // console.log("watched videos are:",res.data)
    // console.log("Tags are:",tags[0])
};
fetchVideos();
},[]);

  return (
    <Container>
      {currentUser && videos.map(video=>(
        <Card key={video._id} video={video}/>
      ))}
    </Container>
  )
}

export default History
