import React,{useEffect,useState} from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Link } from 'react-router-dom'


const Container=styled.div`
width: 360px;
margin-bottom: flex;
display: flex;
margin-top: 10px;
gap: 10px;
&:hover{
    cursor: pointer;
}
`
const Image=styled.img`
width: 100%;
height: 120px;
background-color: #999;
flex: 1;
`
const Details=styled.div`
display: flex;
flex-direction: column;
justify-content: space-around;
`
const Title=styled.h1`
font-size: 36px;
font-weight: 500;
color: ${({theme}) => theme.text};
`
const Description=styled.p`
font-size: 18px;
color: ${({theme}) => theme.textSoft};
`


function VideoPlaylist({videos}) {
  const [video,setVideo]=useState([])
    // console.log("video is in playlist:",videos)
    useEffect(()=>{
      const fetchVideos=async()=>{
          const res= await axios.get(`/api/v1/video/find/${videos}`)
          // console.log("video in playlist is",res)
          setVideo(res.data.data)
      }
      fetchVideos()
  
  },[videos])


  return (
    <Link to={`/video/${video?._id}`} style={{textDecoration:"none"}}>
    <Container>
      <Image src={video.thumbnail}/>
      <Details>
<Title>{video.title}</Title>
<Description>{video.description}</Description>
      </Details>
    </Container>

    </Link>
  )
}

VideoPlaylist.propTypes={
videos:PropTypes.string
}

export default VideoPlaylist