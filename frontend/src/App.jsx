import React from "react";
import { Routes, Route } from "react-router-dom"; 
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import MyProfile from "./pages/MyProfile";
import About from "./pages/About";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import MyAppointment from "./pages/MyAppointment";
import Appointment from "./pages/Appointment";
import Navbar from "./components/Navbar"
import Footer from "./components/Footer";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';



const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer/>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-appointments" element={< MyAppointment />} />
        <Route path="/doctors" element={<Doctors/>}/>
        <Route path="/doctors/:speciality?" element={<Doctors />} />

        <Route path="/about" element={<About/>}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/appointment/:docId" element={<Appointment />} />
        <Route path='/chatbot' element={<Chatbot />} />
        


  
      </Routes>
      <Footer/>
    </div>
  );
};

export default App;
