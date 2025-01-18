import React from 'react';
import Navbar from './Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUp from '@/pages/SignUp';
import Login from '@/pages/Login';
import Landing from '@/pages/Landing';

const generateTriangles = (count) => {
  return Array.from({ length: count }).map(() => ({
    top: Math.random() * 100 + '%', 
    left: Math.random() * 100 + '%', 
    size: Math.random() * 20 + 10 + 'px', 
    duration: Math.random() * 5 + 5 + 's',
    delay: Math.random() * 5 + 's',
  }));
};

const NotLogedInHome = () => {
  const triangles = generateTriangles(100);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 relative overflow-x-hidden">
        <Navbar />
        <div className="floating-triangles">
          {triangles.map((triangle, index) => (
            <div
              key={index}
              className="triangle"
              style={{
                top: triangle.top,
                left: triangle.left,
                borderLeftWidth: triangle.size,
                borderRightWidth: triangle.size,
                borderBottomWidth: `calc(${triangle.size} * 1.5)`,
                animationDuration: triangle.duration,
                animationDelay: triangle.delay,
              }}
            ></div>
          ))}
        </div>
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default NotLogedInHome;
