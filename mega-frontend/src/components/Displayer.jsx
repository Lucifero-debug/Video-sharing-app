import React, {useEffect, useState}from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import  {updateplaylist}  from '../redux/playlistSlice.js'
import {useSelector,useDispatch} from "react-redux"
import { useNavigate } from 'react-router-dom'

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


function Displayer({playlist}) {

 
  const {currentplaylist}=useSelector((state)=>state.playlist)
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const handleClick=()=>{
    dispatch(updateplaylist(playlist))
    console.log("current playlist is:",currentplaylist)
    navigate("/playlist/video")
  }
  
  return (
    <>
      <Container onClick={handleClick}>
      <Image src={playlist.thumbnail}/>
      <Details>
<Title>{playlist.name}</Title>
<Description>{playlist.description}</Description>
      </Details>
    </Container>    
       
</>
  )
}

Displayer.propTypes={
playlist:PropTypes.object,
setQ:PropTypes.func
}

export default Displayer
