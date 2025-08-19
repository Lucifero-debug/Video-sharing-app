import React, { useEffect, useState } from 'react'
import styled from "styled-components"
import Card from './Card';
import axios from "axios";
import PropTypes from 'prop-types'


const Container = styled.div `
flex:2;
`
function Recommendation({tags}) {

const [videos,setVideos]=useState([]);
    
useEffect(()=>{
const fetchVideos=async()=>{
    const res=await axios.get(`/api/v1/video/tags?tags=${tags[0]}`)
    setVideos(res.data.data)
    // console.log("Recommended videos are:",res.data.data)
    // console.log("Tags are:",tags[0])
};
fetchVideos();
},[tags]);

  return (
    <Container>
      {videos.map(video=>(
        <Card type="sm" key={video._id} video={video}/>
      ))}
    </Container>
  )
}
Recommendation.propTypes={
    tags:PropTypes.array
}
export default Recommendation
