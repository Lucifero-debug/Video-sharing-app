import React, {useState,useContext,useEffect}from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import VideoContainer from '../Pages/videoContainer'
import axios from 'axios';
import { useSelector } from "react-redux";


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


function Adder({playlist}) {

 
  const [open,setOpen]=useState(false);
  const {currentVideo}=useSelector((state)=>state.video)
  const handleAdd=async()=>{
try {
await axios.post(`/api/v1/playlist/${playlist?._id}/${currentVideo?._id}/add`)
          }
     catch (error) {
        console.log("Error while adding to playlist:",error)
    }
  }
  
  return (
    <>
    <Container onClick={handleAdd}>
      <Image src={playlist.thumbnail}/>
      <Details>
<Title>{playlist.name}</Title>
<Description>{playlist.description}</Description>
      </Details>
    </Container>
</>
  )
}

Adder.propTypes={
playlist:PropTypes.object
}

export default Adder
