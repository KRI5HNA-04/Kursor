"use client";

import React, { useState } from "react";
import Navbar from "../Components/Navbar";

const ContactPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    email: "",
    phone: "",
    employees: "solo",
  });
  const [status, setStatus] = useState<null | "success" | "error" | "loading">(
    null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmployeeSelect = (type: "solo" | "team") => {
    setForm({ ...form, employees: type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({
          firstName: "",
          lastName: "",
          jobTitle: "",
          email: "",
          phone: "",
          employees: "solo",
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Soft dark gradient background for dark mode */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#18181b] via-[#23232b] to-[#18181b] -z-20" />
      {/* 3D glowing orange spheres */}
      <div className="absolute top-[-80px] left-[-60px] w-60 h-60 bg-gradient-to-br from-orange-400 via-orange-300 to-yellow-200 rounded-full blur-2xl opacity-80 -z-10" />
      <div className="absolute top-[40%] left-[-40px] w-32 h-32 bg-gradient-to-br from-orange-300 via-orange-200 to-yellow-100 rounded-full blur-2xl opacity-70 -z-10" />
      <div className="absolute bottom-[-20px] left-[10%] w-72 h-72 bg-gradient-to-br from-orange-400 via-orange-300 to-yellow-200 rounded-full blur-3xl opacity-80 -z-10" />
      <div className="absolute top-[-60px] right-[-80px] w-80 h-80 bg-gradient-to-br from-orange-400 via-orange-300 to-yellow-200 rounded-full blur-3xl opacity-80 -z-10" />
      <div className="absolute bottom-[-60px] right-[5%] w-40 h-40 bg-gradient-to-br from-orange-300 via-orange-200 to-yellow-100 rounded-full blur-2xl opacity-70 -z-10" />
      <Navbar />
      <div
        className="flex flex-col md:flex-row max-w-6xl mx-auto mt-40 rounded-2xl shadow-xl overflow-hidden bg-white/5 backdrop-blur-lg border border-white/30"
        style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)" }}
      >
        {/* Left - Contact Form */}
        <div className="w-full md:w-1/2 p-10 space-y-6 bg-white/10 backdrop-blur-lg border-r border-white/20">
          <h2 className="text-3xl font-bold text-white">Let's Connect</h2>
          <p className="text-gray-300">
            Need help with something? Want a demo? Get in touch and we'll get
            back within 2 hours.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <input
                name="firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
                required
                className="w-1/2 px-4 py-2 border border-white/20 rounded-lg bg-black/20 text-white placeholder-gray-400"
              />
              <input
                name="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
                required
                className="w-1/2 px-4 py-2 border border-white/20 rounded-lg bg-black/20 text-white placeholder-gray-400"
              />
            </div>
            <input
              name="jobTitle"
              placeholder="Job title"
              value={form.jobTitle}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-white/20 rounded-lg bg-black/20 text-white placeholder-gray-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Work email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-white/20 rounded-lg bg-black/20 text-white placeholder-gray-400"
            />
            <input
              name="phone"
              placeholder="Phone number"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-white/20 rounded-lg bg-black/20 text-white placeholder-gray-400"
            />

            <div>
              <p className="font-medium mb-2">Number of employees</p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleEmployeeSelect("solo")}
                  className={`w-1/2 p-3 border rounded-lg transition-colors duration-200 ${
                    form.employees === "solo"
                      ? "border-orange-400 bg-orange-400/10 text-orange-200"
                      : "border-white/20 bg-black/10 text-white"
                  }`}
                >
                  I'm a solo creator
                </button>
                <button
                  type="button"
                  onClick={() => handleEmployeeSelect("team")}
                  className={`w-1/2 p-3 border rounded-lg transition-colors duration-200 ${
                    form.employees === "team"
                      ? "border-orange-400 bg-orange-400/10 text-orange-200"
                      : "border-white/20 bg-black/10 text-white"
                  }`}
                >
                  I'm part of a team
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 rounded-lg bg-orange-500/90 hover:bg-orange-400 text-white font-semibold transition shadow-lg"
            >
              {status === "loading" ? "Sending..." : "Get in touch"}
            </button>
            {status === "success" && (
              <p className="text-green-400 font-medium text-center">
                Message sent successfully!
              </p>
            )}
            {status === "error" && (
              <p className="text-red-400 font-medium text-center">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        </div>

        {/* Right - Testimonial/Visual Section */}
        <div className="hidden md:block md:w-1/2 bg-white/10 backdrop-blur-lg p-10 flex flex-col justify-center">
          <div className="relative w-full h-64 mb-6 rounded-xl overflow-hidden">
            <video
              src="/background_vid.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-gray-900/40 z-10" />
          </div>
          <div className="relative z-20">
            <p className="text-lg text-gray-200 font-medium mb-4">
              “Untitled's software helps us manage cash flow, financial
              reporting, and payroll with ease. It's a great solution for
              startups.”
            </p>
            <p className="font-semibold text-orange-200">Maya Rothwell</p>
            <p className="text-gray-400 text-sm">
              Founder & CEO, Open Ventures
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
