import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styled from "styled-components"
import { format } from 'timeago.js';

const Container=styled.div `
display: flex;
gap: 10px;
margin: 20px 0px;
`
const Avatar=styled.img `
width: 50px;
height: 50px;
border-radius: 50%;
`;

const Details=styled.div `
display: flex;
flex-direction: column;
gap: 10px;
color: ${({theme}) => theme.text};
`
const Name=styled.span `
font-size: 13px;
font-weight: 500;
`
const Date=styled.span `
font-size: 12px;
font-weight: 400;
color: ${({theme}) => theme.textSoft};
margin-left: 5px;
`
const Text=styled.span `
font-size: 14px;
`

function Comment(comment) {
  const [commentUser,setCommentUser]=useState("")
  useEffect(()=>{
    const fetchUser=async()=>{
      try {
       const res= await axios.get(`/api/v1/users/find/${comment.comment.owner}`)
setCommentUser(res.data.data)
// console.log("Comment user is:",res.data.data)
      } catch (error) {
        console.log("Error while fetching comments information",error)
      }
    }
    fetchUser()
  },[comment])

  return (
    <Container>
      <Avatar src={commentUser?.avatar}/>
      <Details>
        <Name>{commentUser?.username} <Date>{format(comment.comment.createdAt)}</Date> </Name>
        <Text>{comment.comment.content}</Text>
      </Details>
    </Container>
  )
}

export default Comment
