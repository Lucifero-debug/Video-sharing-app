import React, {useState} from 'react'
import styled from "styled-components"
import axios from "axios"
import { useDispatch } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from '../redux/userSlice';
import {auth,provider} from "../firebase"
import {signInWithPopup } from "firebase/auth"
import {useNavigate} from "react-router-dom"

const Container=styled.div `
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
height: calc(100vh - 56px);
color: ${({theme})=>theme.text};
`;

const Wrapper=styled.div `
display: flex;
align-items: center;
flex-direction: column;
background-color: ${({theme})=>theme.bgLighter};
border: 1px solid ${({theme})=>theme.soft};
padding: 20px 50px;
gap: 10px;
`
const Title=styled.h1 `
font-size: 20px;
font-weight: 300;
`
const SubTitle=styled.h2 `
font-size: 40px;
font-weight: 400;
`
const Input=styled.input `
border: 1px solid ${({theme})=>theme.soft};
`
const Button=styled.button `
border-radius: 3px;
border: none;
padding:10px 20px;
font-weight: 500;
cursor: pointer;
background-color: ${({theme})=>theme.soft};
color:${({theme})=>theme.textSoft};
&:active{
    transform: scale(1.1);
}
`

const More=styled.div `
display: flex;
margin-top: 10px;
font-size: 12px;
color: ${({theme})=>theme.textSoft};
`
const Links=styled.div `
margin-left: 30px;
`
const Link=styled.span `
margin-left: 30px;
&:hover{
    cursor: pointer;
}
`

const Login =() => {

const [user,setUser]=useState("")
const [password,setPassword]=useState("")
const [email,setEmail]=useState("")
const [name,setName]=useState("")
const dispatch=useDispatch()
const navigate=useNavigate()

  const register=async(e)=>{
    e.preventDefault()
try {
  const regUser=await axios.post("/api/v1/users/register",{username:user,password:password,email:email,fullName:name})
  // console.log("registerd user is:",regUser)
} catch (error) {
  console.log("error registering user",error)
}
  }

   const sign=async(e)=>{
    e.preventDefault()
    try {
      const signUser=await axios.post("/api/v1/users/login",{username:user,password:password})
      console.log("logged in user:",signUser.data.data.user)
      dispatch(loginSuccess(signUser.data.data.user)) && navigate('/random')
    } catch (error) {
      console.log("error signing in user",error)
      dispatch(loginFailure())
    }
   }

   const signInWithGoogle =async()=>{
    dispatch(loginStart())
    signInWithPopup(auth,provider)
    .then((result)=>{
      axios.post("/api/v1/users/google",{
        name:result.user.displayName,
        email:result.user.email,
        img:result.user.photoUrl
      }).then((res)=>{
        dispatch(loginSuccess(res.data))
      })
    })
    .catch((error)=>{
      console.log(error)
      dispatch(loginFailure())
    })
   }

  return (
    <Container>
      <Wrapper>
     <Title>Sign In</Title>
     <SubTitle>To Continue To VideoTube</SubTitle>
     <Input placeholder='username'onChange={(e)=>setUser(e.target.value)}/>
     <Input type='password' placeholder='password' onChange={(e)=>setPassword(e.target.value)}/>
     <Button onClick={sign}>Sign IN</Button>
     <Title>OR</Title>
     <Button onClick={signInWithGoogle}>Sign In With Google</Button>
     <Title>OR</Title>
     <Input placeholder='username'onChange={(e)=>setUser(e.target.value)}/>
     <Input placeholder='email' onChange={(e)=>setEmail(e.target.value)}/>
     <Input type='password' placeholder='password'onChange={(e)=>setPassword(e.target.value)}/>
     <Input type='fullName' placeholder='Full Name'onChange={(e)=>setName(e.target.value)}/>
     <Button onClick={register}>Sign UP</Button>
      </Wrapper>
      <More>
        English(USA)
        <Links>
            <Link>Help</Link>
            <Link>Privacy</Link>
            <Link>Terms</Link>
        </Links>
      </More>
    </Container>
  )
}

export default Login
