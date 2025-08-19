import React, { useEffect } from 'react'
import styled from "styled-components"
import VideoPlaylist from '../components/videoplalist';
import {useSelector , useDispatch} from "react-redux"
import axios from 'axios';
import { fetchSuccess } from '../redux/videoid';

const Container = styled.div `
display: flex;
flex-direction: column;
/* justify-content: space-between; */
flex-wrap: wrap;
gap: 10px;
`
function VideoContainer() {
  const {currentplaylist}=useSelector((state)=>state.playlist)
  const currentVideoId=useSelector((state)=>state.videoId)
  const dispatch=useDispatch()

  useEffect(()=>{
    const fetchVideos=async()=>{
    try {
   const res= await axios.get(`/api/v1/playlist/${currentplaylist?._id}/getone`)
  //  console.log("video of playlist is:",res.data.data.videos)
    dispatch(fetchSuccess(res.data.data.videos))
    // console.log("current palylist is",currentPlaylist)

    }
 catch (error) {
  console.log("error fetching playlist videos",error)
}}
fetchVideos()
  },[currentplaylist,dispatch])
// console.log("video supplied here:",video)
  return (
    <>
   { currentVideoId && <Container >
      {currentVideoId.currentVideoId?.map(video=>(
        <VideoPlaylist key={video} videos={video}/>
      ))} 
    </Container>}
    </>
  )
}

export default VideoContainer
