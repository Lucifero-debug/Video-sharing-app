import styled, { ThemeProvider } from "styled-components"
import Menu from "./components/Menu"
import Navbar from "./components/Navbar"
import './Reset.css';
import { darkTheme,lightTheme } from "./utils/Theme";
import { useState,useEffect } from "react";
import { BrowserRouter,Routes,Route, Outlet } from "react-router-dom"
import Home from "./Pages/Home.jsx"
import Video from "./Pages/Video.jsx";
import Login from "./Pages/Login.jsx"
import Search from "./Pages/Search.jsx";
import Genre from "./Pages/Genre.jsx";
import History from "./Pages/History.jsx";
import ListPlaylist from "./Pages/ListPlaylist.jsx";
import VideoContainer from "./Pages/videoContainer.jsx";
const Container=styled.div`
display:flex;
`

const Main=styled.div`
flex:7;
background-color:${({theme}) => theme.bg} ;
`
const Wrapper=styled.div`
padding: 22px 96px;
`;

function App() {
  const savedMode=localStorage.getItem("darkMode")==="true"
const [darkMode,setDarkMode] = useState(savedMode)

useEffect(()=>{
localStorage.setItem("darkMode",darkMode)
},[darkMode])

const toggleDarkMode = () => {
  setDarkMode((prevMode) => !prevMode);
};

useEffect(() => {
  localStorage.setItem("darkMode", JSON.stringify(darkMode));
});
 const [types,setTypes]=useState("")
 const [tags,setTags]=useState("")
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>


    <Container>
    <BrowserRouter>
    <Menu darkMode={darkMode} toggleDarkMode={toggleDarkMode}/>
    <Main>
     <Navbar/>
    <Wrapper>
     <Routes>
      <Route path="/" element={<Outlet/>}>
      <Route index element={<Home types={types} />} />
      <Route path="random" element={<Home types="random"/>}/>
      <Route path="trend" element={<Home types="trend"/>} />
      <Route path="subscriptions" element={<Home types="sub"/>}/>
      <Route path="search/:query" element={<Search/>}/>
      <Route path="signin" element={<Login/>}/>
      <Route path="/music" element={<Genre tags="music"/>} />
      <Route path="/gaming" element={<Genre tags="gaming"/>} />
      <Route path="/movies" element={<Genre tags="movies"/>} />
      <Route path="/news" element={<Genre tags="news"/>} />
      <Route path="/sports" element={<Genre tags="sports"/>} />
      <Route path="/history" element={<History/>} />
      <Route path="/playlist" element={<ListPlaylist/>} />
      <Route path="/playlist/video" element={<VideoContainer/>} />
      <Route path="video">
      <Route path=":id" element={<Video/>}/>
      </Route>  
        
      </Route>
     </Routes>
    </Wrapper>
    </Main>
    </BrowserRouter>
    </Container>
    </ThemeProvider>
  )
}

export default App
