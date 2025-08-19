import React, { useEffect, useState } from 'react'
import styled from "styled-components"
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import Comments from '../components/Comments';
import Card from '../components/Card'
import {useSelector,useDispatch} from "react-redux"
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { fetchFailure, fetchSuccess,likes,dislikes } from '../redux/videoSlice';
import { subscription } from '../redux/userSlice.js';
import { fetchChannel,increaseCount,decreaseCount } from '../redux/subsSlice.js';
import { updateViewsCount } from '../redux/viewSlice.js';
import { format } from 'timeago.js';
import Recommendation from '../components/Recommendation.jsx';
import AddPlaylist from './AddPlaylist.jsx';

const Container = styled.div `
display: flex;
gap:24px;`
const Content = styled.div `
flex:5;
`
const VideoWrapper=styled.div ``
const Title=styled.h1 `
font-size: 18px;
font-weight: 400;
margin-top: 20px;
margin-bottom: 10px;
color: ${({theme}) => theme.text};
`
const Details=styled.div `
display: flex;
align-items: center;
justify-content: space-between;
`
const Info=styled.span `
color: ${({theme}) => theme.textSoft};
`
const Buttons=styled.div `
display: flex;
gap: 20px;
color: ${({theme}) => theme.text};
`
const Button= styled.div `
display: flex;
align-items: center;
gap: 5px;
cursor: pointer;
&:hover{
  cursor: pointer;
}
&:active{
  transform: scale(1.1);
}
`
const Hr=styled.hr `
margin:15px 0px;
border: 0.5px solid ${({theme}) => theme.soft};
`;

const Channel=styled.div `
display: flex;
justify-content: space-between;
`;

const ChannelInfo=styled.div `
display: flex;
gap: 20px;
`

const Image=styled.img`
width: 50px;
height: 50px;
border-radius: 50%;
`

const ChannelDetail=styled.div `
display: flex;
flex-direction: column;
color: ${({theme}) => theme.text};
`

const ChannelName=styled.span `
font-weight: 500;
`

const ChannelCounter=styled.span `
margin-top: 5px;
margin-bottom: 20px;
color: ${({theme}) => theme.textSoft};
font-size: 12px;
`

const Description=styled.p `
font-size: 14px;
`

const Subscribe=styled.button `
background-color: ${({isSubscribed})=>isSubscribed ? "#00cc00" : "#cc1a00"};
font-weight: 500;
color: white;
border: none;
border-radius: 3px;
height: max-content;
padding: 10px 20px;
cursor: pointer;
&:hover{
  cursor: pointer;
}
&:active{
  transform: scale(1.06);
}
`
const VideoFrame=styled.video`
max-height: 620px;
width: 100%;
height: 100%;
object-fit: contain;
`;

export default function Video() {
  const {currentUser}=useSelector((state)=>state.user)
  // console.log("Current user:",currentUser)
  const {currentVideo}=useSelector((state)=>state.video)
  const {currentChannel}=useSelector((state)=>state.channel)
  const {viewsCount}=useSelector((state)=>state.views)
const [open,setOpen]=useState(false);

const dispatch=useDispatch()

const path=useLocation().pathname.split("/")[2]

useEffect(()=>{
  const fetchData=async ()=>{
    try {
      const videoResponse=await axios.get(`/api/v1/video/find/${path}`)
      const channelResponse=await axios.get(`/api/v1/users/find/${videoResponse.data.data.owner}`)
      dispatch(fetchChannel(channelResponse.data.data))
      dispatch(fetchSuccess(videoResponse.data.data))
      dispatch(updateViewsCount(videoResponse.data.data.views.length))
      // dispatch(increamentViewsCount())
      // console.log("video is:",videoResponse.data.data)
      // console.log("channel is:",channelResponse.data.data)
    } catch (error) {
      console.log("Error is:",error)
      dispatch(fetchFailure())
    }
  }
  fetchData()
},[path,dispatch])
// console.log("current video:",currentVideo)
// console.log("current channel:",currentChannel)

// console.log("path is:",path)



const handleLikes=async()=>{
try {
  await axios.post(`/api/v1/users/togglelike/${currentVideo._id}`)
  dispatch(likes(currentUser._id))
} catch (error) {
  console.log("Error while liking the video",error)
}
}

const handleDislikes=async()=>{
try {
  await axios.post(`/api/v1/users/toggledislike/${currentVideo._id}`)
  dispatch(dislikes(currentUser._id))
} catch (error) {
  console.log("Error while disliking the video",error)
}
}

const handlesub=async()=>{
 try {
  if (currentUser.subscribedUser?.includes(currentChannel?._id)) {
    await axios.put(`/api/v1/users/unsub/${currentChannel?._id}`)
    dispatch(subscription(currentChannel?._id))
    dispatch(decreaseCount(currentChannel?._id))
    // console.log("Subscriber count is:",currentChannel?.subscribers)
  }
  else{
    await axios.put(`/api/v1/users/sub/${currentChannel?._id}`)
    dispatch(subscription(currentChannel?._id))
    dispatch(increaseCount(currentChannel?._id))
    // console.log("Subscriber count is:",currentChannel?.subscribers)

  }
 } catch (error) {
  console.log("Error while subscribing",error)
 }
}

// const handlePlaylist=async()=>{
//   try {
//     const userPlaylist=await axios.get(`/api/v1/playlist/${currentUser._id}/get`)
//     if (!userPlaylist.videos.includes(currentVideo._id)) {
//       await axios.
//     }else{

//     }
//   } catch (error) {
//     console.log("Error while adding video to playlist",error)
//   }
// }

  return (
    <>
    {!open && <Container>
      <Content>
        <VideoWrapper>
         <VideoFrame src={currentVideo?.videoFile} controls/>
        </VideoWrapper>
        <Title>{currentVideo?.title}</Title>
        <Details>
          <Info>{viewsCount} views &nbsp; &#8226; {format(currentVideo?.createdAt)} </Info>
          <Buttons>
            <Button onClick={handleLikes} disabled={currentVideo?.likes?.includes(currentUser?._id)}>{currentVideo?.likes?.includes(currentUser?._id)?(<ThumbUpIcon/>): <ThumbUpOutlinedIcon/>}{currentVideo?.likes.length} </Button>
            <Button onClick={handleDislikes} disabled={currentVideo?.dislikes?.includes(currentUser?._id)}>{currentVideo?.dislikes?.includes(currentUser?._id)?(<ThumbDownIcon/>): <ThumbDownOffAltOutlinedIcon/>}{currentVideo?.dislikes.length} </Button>
            <Button><ReplyOutlinedIcon/> Share </Button>
            <Button onClick={()=>setOpen(true)}> <AddTaskOutlinedIcon/> Save </Button>
          </Buttons>
        </Details>
        <Hr/>
        <Channel>
          <ChannelInfo>
            <Image src={currentChannel?.avatar}></Image>
            <ChannelDetail>
              <ChannelName>{currentChannel?.username}</ChannelName>
              <ChannelCounter>{currentChannel?.subscribers} Subscribers</ChannelCounter>
              <Description>
              {currentVideo?.description}
              </Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe onClick={handlesub} isSubscribed={currentUser?.subscribedUser?.includes(currentChannel?._id)}>{currentUser?.subscribedUser?.includes(currentChannel?._id)?"SUBSCRIBED":"SUBSCRIBE"}</Subscribe>
        </Channel>
        <Hr/>
        <Comments videoId={currentVideo?._id}/>
      </Content>
      <Recommendation tags={currentVideo?.tags}/>
    </Container>}
    {open && <AddPlaylist/> }
    </>
  )
}
