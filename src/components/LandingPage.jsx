import React, { useState } from 'react';
import shoppingImg from '@/assets/shopping-removebg-preview.png';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const LandingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const floatingImageVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const testimonials = [
    {
      name: "John Doe",
      title: "Store Owner",
      feedback: "This CRM has completely transformed the way I manage my business. Highly recommended!",
    },
    {
      name: "Jane Smith",
      title: "Business Analyst",
      feedback: "I love how easy it is to use. The insights I get from this tool are invaluable!",
    },
    {
      name: "Michael Brown",
      title: "Operations Manager",
      feedback: "Managing inventory and tracking sales has never been this efficient. A must-have for any business!",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;
    const mailtoLink = `mailto:support@yourdomain.com?subject=Message from ${name}&body=${message} (Contact Email: ${email})`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="min-h-screen mt-12 flex flex-col gap-12">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row px-4 md:px-8 items-center justify-between gap-4">
        <div className="text-white flex flex-col gap-6 md:w-[60%]">
          <h4 className="font-semibold text-2xl">
            Elevate your business with the ultimate CRM tool designed to simplify and supercharge your management experience.
          </h4>
          <h2 className="font-bold text-4xl">
            Welcome to the Future of Store Management!
          </h2>
          <p className="text-lg leading-relaxed">
            Empower your team with insights, streamline operations, and take control of every aspect of your business. Whether you're tracking sales, managing inventory, or analyzing performance, our CRM has got you covered.
          </p>

          <div className="flex gap-12">
            <button className="bg-white text-slate-900 font-bold py-3 px-6 rounded-lg hover:bg-gray-400 duration-200 transition">
              <NavLink to={`/login`}>
                <span className="capitalize">Login</span>
              </NavLink>
            </button>

            <button className="bg-white text-slate-900 font-bold py-3 px-6 rounded-lg hover:bg-gray-400 duration-200 transition">
              <NavLink to={`/signup`}>
                <span className="capitalize">Sign up</span>
              </NavLink>
            </button>
          </div>
        </div>

        <div>
          <motion.div
            variants={floatingImageVariants}
            animate="animate"
          >
            <img className="h-full" src={shoppingImg} alt="Shopping" />
          </motion.div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="py-12 px-6 text-white">
        <h3 className="text-3xl font-bold text-center mb-8">About Us</h3>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <p className="text-lg leading-relaxed md:w-[80%]">
            We are a team of passionate developers and business strategists dedicated to creating tools that empower businesses to achieve their full potential. 
            Our CRM solution is designed with simplicity and efficiency in mind, ensuring that you can focus on what matters most — growing your business. 
            Join thousands of happy customers who trust our platform to revolutionize their operations.
          </p>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-400 py-12 px-6">
        <h3 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h3>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white shadow-md p-6 rounded-lg max-w-md text-center">
              <p className="text-lg italic">{`" ${testimonial.feedback} "`}</p>
              <h4 className="font-bold text-xl mt-4">{testimonial.name}</h4>
              <p className="text-gray-600">{testimonial.title}</p>
            </div>
          ))}
        </div>
      </div>

            {/* Contact Us Section */}
            <div className="bg-slate-950 opacity-80 py-12 px-6" id='contact'>
                <h3 className="text-3xl font-bold text-center mb-8 text-gray-300">Contact Us</h3>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Right Section (Contact Information) */}
          <div className="flex flex-col gap-6 bg-white shadow-lg p-6 rounded-lg md:w-[40%] text-gray-800">
            <h4 className="text-2xl font-bold mb-4">Get in Touch</h4>
            <p><strong>Email:</strong> support@yourdomain.com</p>
            <p><strong>Phone:</strong> +1 (123) 456-7890</p>
            <p><strong>Location:</strong> 123 Business St, Suite 456, City, Country</p>
          </div>

          {/* Left Section (Contact Form) */}
          <div className="flex flex-col gap-4 bg-white shadow-lg p-6 rounded-lg md:w-[60%]">
            <h4 className="text-2xl font-bold mb-4">Send Us a Message</h4>
            <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                className="p-3 rounded-lg border border-gray-300 focus:outline-none"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                className="p-3 rounded-lg border border-gray-300 focus:outline-none"
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleInputChange}
                className="p-3 rounded-lg border border-gray-300 focus:outline-none h-32"
                required
              ></textarea>
              <button
                type="submit"
                className="bg-slate-950 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-400 hover:text-black duration-200 transition"
              >
                Send Email
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
