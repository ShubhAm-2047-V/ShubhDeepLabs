"use client";

import { useState, useEffect } from "react";
import { Send, Phone, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { dbService } from "@/lib/supabase";

export default function ConsultationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    const loadSiteSettings = async () => {
      try {
        const settings = await dbService.getSiteSettings();
        if (settings) setSiteSettings(settings);
      } catch (e) {
        console.error("Failed to load site settings:", e);
      }
    };
    loadSiteSettings();
  }, []);

  const contactData = siteSettings?.contact || {
    phone: "+91 90288 33275",
    email: "shubdeeplabs@gmail.com",
    address: "Solapur, Maharashtra"
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast.error("Please fill in all required contact details.");
      return;
    }

    setLoading(true);
    try {
      await dbService.addOrder({
        fullName: formData.name,
        collegeName: formData.company || "Commercial Client",
        branch: "Enterprise Business Solution",
        year: "Business",
        projectTitle: "Commercial Business Consultation",
        techRequired: "Enterprise Tech Stack",
        deadline: new Date().toISOString().split('T')[0],
        budget: "Custom Quote",
        description: `Company: ${formData.company || 'N/A'}\nMessage: ${formData.message}`,
        needPPT: false,
        needReport: false,
        needVivaGuidance: false,
        projectStatus: "Pending",
        paymentStatus: "Unpaid"
      });

      toast.success("Consultation request received! Our engineering team will contact you shortly.", {
        style: {
          background: '#3B2818',
          color: '#FFF7EE',
          border: '1.5px solid #CFE3D2',
          borderRadius: '12px'
        }
      });
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit consultation request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sand-dune-card p-8 sm:p-12 border-2 border-[#CFE3D2]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <span className="sage-badge px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Direct Engineering Desk
            </span>
            <h2 className="text-3xl font-extrabold text-[#3B2818] mt-4 mb-4">
              Schedule a Solution Consultation
            </h2>
            <p className="text-sm font-medium text-[#4A3525] leading-relaxed mb-8">
              Let us review your software architecture or product requirements. Our team will prepare a technical blueprint and custom quote.
            </p>
          </div>

          <div className="space-y-4 font-bold text-[#3B2818] pt-6 border-t border-[#D5C4A6]/50">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-[#4E7854]" />
              <span>{contactData.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-[#4E7854]" />
              <span>{contactData.email}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <form onSubmit={handleFormSubmit} className="space-y-4 sand-dune-card-soft p-6 border border-[#D5C4A6]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#3B2818] uppercase mb-1">Your Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full text-sm px-4 py-3 bg-white/90 border border-[#D5C4A6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CFE3D2] text-[#3B2818] font-medium"
                  placeholder="e.g. Sarah Jenkins"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#3B2818] uppercase mb-1">Company / Organization</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full text-sm px-4 py-3 bg-white/90 border border-[#D5C4A6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CFE3D2] text-[#3B2818] font-medium"
                  placeholder="e.g. Acme Corp"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#3B2818] uppercase mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full text-sm px-4 py-3 bg-white/90 border border-[#D5C4A6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CFE3D2] text-[#3B2818] font-medium"
                  placeholder="e.g. +91 9876543210"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#3B2818] uppercase mb-1">Work Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full text-sm px-4 py-3 bg-white/90 border border-[#D5C4A6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CFE3D2] text-[#3B2818] font-medium"
                  placeholder="e.g. sarah@acme.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B2818] uppercase mb-1">Project Scope & Requirements *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="4"
                className="w-full text-sm px-4 py-3 bg-white/90 border border-[#D5C4A6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CFE3D2] text-[#3B2818] font-medium"
                placeholder="Describe your required application, timeline, target features..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-sage-green w-full py-4 text-base flex items-center justify-center cursor-pointer"
            >
              {loading ? "Sending..." : "Submit Business Consultation Request"}
              <Send className="w-4 h-4 ml-2" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
