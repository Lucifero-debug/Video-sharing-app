import React, { useState } from 'react'
import styled from "styled-components"
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import {Link, useNavigate} from "react-router-dom"
import {useSelector} from "react-redux"
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import Upload from './Upload';

const Container= styled.div `
position: sticky;
top: 0;
background-color: ${({theme}) => theme.bgLighter};
height: 56px;
`
const Wrapper= styled.div `
display: flex;
align-items: center;
justify-content: flex-end;
height: 100%;
padding: 0px 20px;
position: relative;
`
const Search=styled.div `
width: 40%;
position: absolute;
left: 0px;
right: 0px;
margin: auto;
display: flex;
align-items: center;
justify-content: space-between;
padding: 5px;
border: 1px solid #ccc;
border-radius: 3px;
color: ${({theme}) => theme.text};
`;
const Input= styled.input `
border: none;
background-color: transparent;
outline: none;
color: ${({theme}) => theme.text};
`;

const Button=styled.button `
padding: 5px 15px;
background-color: transparent;
border: 1px solid #3ea6ff;
color: #3ea6ff;
border-radius: 3px;
font-weight: 500;
margin-top: 10px;
cursor: pointer;
display: flex;
align-items: center;
gap: 5px;
`;
const Misc=styled.div `
height: 20px;
width: 20px;
display: flex;
align-items: center;
justify-content: center;
&:hover{
  cursor: pointer;
  border-radius: 50%;
}
&:active{
  transform: scale(1.07);
}
`
const User=styled.div `
display: flex;
align-items: center;
gap: 10px;
font-weight: 500;
color: ${({theme})=>theme.text};
&:hover{
  cursor: pointer;
}
`
const Avatar=styled.img `
width: 32px;
height: 32px;
border-radius: 50%;
background-color: #999;
`

function Navbar() {
  const [open,setOpen]=useState(false);
  const { currentUser } = useSelector(state => state.user);
  const [q,setQ]=useState("")
const navigate=useNavigate()

  return (
    <>
    <Container>
      <Wrapper>
        <Search>
          <Input 
            placeholder='Search' onChange={e=>{setQ(e.target.value)}}
          />
          <Misc onClick={()=>navigate(`/search/${q}`)}>
            <SearchOutlinedIcon/>
          </Misc>
        </Search>
        {currentUser ? (
          <User>
          <VideoCallOutlinedIcon onClick={()=>setOpen(true)}/>
            <Avatar src={currentUser?.avatar}/>
            {currentUser?.username}
          </User>
          )
        : (
          <Link to="/signin" style={{ textDecoration: "none", color: "inherit" }}>
            <Button>
              <AccountCircleOutlinedIcon />
              SIGN IN
            </Button>
          </Link>
        )}
      </Wrapper>
    </Container>
    {open && <Upload setOpen={setOpen}/>}
    </>
  );
}

export default Navbar;
