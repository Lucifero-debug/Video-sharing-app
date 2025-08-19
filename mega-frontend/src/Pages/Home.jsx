import React, { useState ,useEffect } from 'react'
import styled from "styled-components"
import Card from '../components/Card'
import axios from "axios"
import PropTypes from 'prop-types'


const Container=styled.div `
display: flex;
justify-content: space-between;
flex-wrap: wrap;
`

const Home=({types})=> {
  
  
  const [videos,setVideos]=useState([]);
  
  useEffect(()=>{
    const fetchVideos=async ()=>{
      try {
        console.log("type is:",types)
    const res=await axios.get(`/api/v1/video/${types}`)
   setVideos(res.data.data)
    // console.log("data is:",videos)
    // console.log("user is:",login)
} catch (error) {
  console.log("Error while fetching videos",error)
}
  }
fetchVideos()
},[types])

  return (
    <Container>
  {videos?.map((video)=>(
    <Card key={video._id}  video={video}/>
  ))

  }
    </Container>
  )
}
Home.propTypes={
  types:PropTypes.string
}

export default Home

