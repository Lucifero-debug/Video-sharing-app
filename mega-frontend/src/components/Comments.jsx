import React, { useEffect, useState } from 'react'
import styled from "styled-components"
import Comment from './Comment';
import axios from "axios"
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types'


const Container=styled.div ``;

const NewComment=styled.div `
display: flex;
align-items: center;
gap: 10px;
`;

const Avatar=styled.img `
width: 50px;
height: 50px;
border-radius: 50%;
`;

const Input=styled.input `
border: none;
border-bottom: 1px solid ${({theme}) => theme.soft};
background-color: transparent;
outline: none;
padding: 5px;
width: 100%;
color: ${({theme})=>theme.text};
`;

 function Comments({videoId}) {

  const [comments,setComments]=useState([]);
  const {currentUser}=useSelector((state)=>state.user)
  // console.log("video id is:",videoId)

  useEffect(()=>{
    const fetchComments=async()=>{
      try {
       const res= await axios.get(`/api/v1/comments/${videoId}`)
       setComments(res.data.data)
      //  console.log("Comments are:",res.data.data)

      } catch (error) {
        console.log("Error fetching comments",error)
      }
    }
    fetchComments()
  },[videoId])
  return (
    <Container>
      <NewComment>
        <Avatar src={currentUser?.avatar}/>
            <Input placeholder='Add a Comment'/>
      </NewComment>
      {comments.map(comment=>(
        <Comment key={comment?._id} comment={comment}/>
      ))}
    </Container>
  )
      }
  Comments.propTypes={
    videoId:PropTypes.string
  }

  export default Comments