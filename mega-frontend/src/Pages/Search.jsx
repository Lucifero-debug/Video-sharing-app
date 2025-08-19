import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from "styled-components"
import Card from '../components/Card'
import axios from "axios"

const Container=styled.div`
display: flex;
flex-wrap: wrap;
gap: 10px;
`

function Search() {
const [videos,setVideos]=useState([])
const location=useLocation()
const query=location.pathname.split("/search/")[1];
// console.log("query in serach is:",query)
useEffect(()=>{
    const fetchVideos=async()=>{
const res=await axios.get(`/api/v1/video/search?search=${query}`)
setVideos(res.data.data)
// console.log("searched response is :",res)
    }
    fetchVideos()
},[query])

  return (
    <Container>
      {videos.map(video=>(
        <Card key={video._id} video={video}/>
      ))}
    </Container>
  )
}

export default Search
