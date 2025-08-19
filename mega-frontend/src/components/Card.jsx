import React,{useEffect,useState} from 'react'
import styled from "styled-components"
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import axios from "axios"
import {format} from "timeago.js"



const Container=styled.div `
width: ${(props)=>props.type!== "sm" && "360px"};
margin-bottom: ${(props)=>props.type==="sm"&&"flex"};
cursor: pointer;
display: ${(props)=>props.type=== "sm" && "flex"};
gap:10px;
margin-top: 10px;
`
const Image=styled.img `
width: 100%;
height: ${(props)=>(props.type==="sm"?"120px":"202px")};
background-color: #999;
flex:1;
`
const Details=styled.div `
display: flex;
margin-top: ${(props)=>props.type!=="sm"&&"16px"};
gap: 12px;
flex:1;
`
const ChannelImage= styled.img `
width: 36px;
height: 36px;
border-radius: 50%;
background-color: #999;
display: ${(props)=>props.type==="sm"&&"none"};
`
const Texts=styled.div ``
const Title=styled.h1`
font-size: 16px;
font-weight: 500;
color: ${({theme}) => theme.text};
`
const ChannelName=styled.h2 `
font-size: 14px;
margin: 9px 0px;
color:${({theme}) => theme.textSoft}
`
const Info=styled.div `
font-size: 14px;
color: ${({theme}) => theme.textSoft};
`;


const Card = ({ type, video }) => {
  const [user,setUser]=useState([])
  /* console.log("video is:",video.owner) */
  
  
  useEffect(()=>{
    const fetchUser=async()=>{
      try{
  const channel=await axios.get(`/api/v1/users/find/${video?.owner}`)
  setUser(channel?.data.data)
      }catch(error){
    console.log("error is",error)  }
    }
    fetchUser()
  },[video?.owner])
  /* console.log("user video is:",user) */
const handleViews=async()=>{
  try{
const addView=await axios.post(`/api/v1/video/${video?._id}/addview`)
console.log("views on:",addView)
console.log("views array are:",video?.views)
  }catch(error){
console.log("Error adding views",error)
  }
}

  return (
    <Link to={`/video/${video?._id}`} style={{textDecoration:"none"}}>
    <Container type={type} onClick={handleViews}>
      <Image type={type} src={video?.thumbnail} />
      <Details>
      <ChannelImage type={type} src={user?.avatar}/>
      <Texts>
        <Title>{video?.title}</Title>
        <ChannelName>{user?.username}</ChannelName>
        <Info>{video?.views.length} views &nbsp; &#8226; {format(video?.createdAt)}</Info>
      </Texts>
      </Details>
    </Container>
    
    </Link>
  )
}

Card.propTypes ={
type:PropTypes.string,
video:PropTypes.object
}

export default Card
