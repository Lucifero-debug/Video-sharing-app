import React, { useEffect, useState } from 'react'
import styled from "styled-components"
import Card from '../components/Card';
import axios from "axios";
import PropTypes from 'prop-types'


const Container = styled.div `
display: flex;
justify-content: space-between;
flex-wrap: wrap;
`
function Genre({tags}) {

const [videos,setVideos]=useState([]);
    
useEffect(()=>{
const fetchVideos=async()=>{
    const res=await axios.get(`/api/v1/video/tags?tags=${tags}`)
    setVideos(res.data.data)
    // console.log("Recommended videos are:",res.data.data)
    // console.log("Tags are:",tags[0])
};
fetchVideos();
},[tags]);

  return (
    <Container>
      {videos.map(video=>(
        <Card key={video._id} video={video}/>
      ))}
    </Container>
  )
}
Genre.propTypes={
    tags:PropTypes.string
}
export default Genre
