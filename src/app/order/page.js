"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ClipboardList, GraduationCap, Calendar, DollarSign, BookOpen, Layers, CheckSquare, ChevronRight, HelpCircle, CornerDownRight } from "lucide-react";
import toast from "react-hot-toast";
import { dbService } from "@/lib/supabase";

function OrderForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL State Pre-fills
  const prePlan = searchParams.get("plan");
  const preCategory = searchParams.get("category");

  const [formData, setFormData] = useState({
    fullName: "",
    collegeName: "",
    branch: "",
    year: "",
    projectTitle: "",
    techRequired: "",
    deadline: "",
    budget: "",
    description: "",
    needPPT: false,
    needReport: false,
    needVivaGuidance: false,
  });

  const [loading, setLoading] = useState(false);

  const [prevPlan, setPrevPlan] = useState(null);
  const [prevCategory, setPrevCategory] = useState(null);

  if (prePlan !== prevPlan || preCategory !== prevCategory) {
    setPrevPlan(prePlan);
    setPrevCategory(preCategory);

    let budgetVal = "";
    let descVal = "";
    let techVal = "";
    let pptVal = false;
    let reportVal = false;
    let vivaVal = false;
    
    if (prePlan === "easy") {
      budgetVal = "";
      descVal = "Easy Plan selected. Basic clean UI layout and draft report details.";
      pptVal = true;
      reportVal = true;
    } else if (prePlan === "medium") {
      budgetVal = "";
      descVal = "Medium Plan selected. Relational database, multi-feature custom UI structure, and viva notes.";
      pptVal = true;
      reportVal = true;
      vivaVal = true;
    } else if (prePlan === "hard") {
      budgetVal = "";
      descVal = "Hard Plan selected. Advanced logic (AI/ML models or APIs), direct Zoom installation support, full thesis-grade report, and explanation sheets.";
      pptVal = true;
      reportVal = true;
      vivaVal = true;
    }

    if (preCategory) {
      techVal = preCategory === "AI-ML" ? "Python, TensorFlow, OpenCV" :
                preCategory === "Web-Dev" ? "Next.js, Tailwind, React, Node.js" :
                preCategory === "Android" ? "Flutter or React Native App" :
                preCategory === "IoT" ? "ESP32 Controller, C++, Sensors" : "";
    }

    setFormData((prev) => ({
      ...prev,
      budget: budgetVal || prev.budget,
      description: descVal || prev.description,
      techRequired: techVal || prev.techRequired,
      needPPT: pptVal || prev.needPPT,
      needReport: reportVal || prev.needReport,
      needVivaGuidance: vivaVal || prev.needVivaGuidance,
    }));
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.collegeName || !formData.projectTitle || !formData.deadline || !formData.budget) {
      toast.error("Please fill out all mandatory fields.");
      return;
    }

    setLoading(true);
    try {
      await dbService.addOrder(formData);
      toast.success("Project plan logged in our ledger!", {
        className: "sketch-card border-2 border-[#2C2C2C] bg-[#FAF6EE] text-[#2C2C2C] font-marker"
      });
      
      const waMsg = encodeURIComponent(
        `Hello Shubdeep Labs, I have configured my project plan order request!\n\nName: ${formData.fullName}\nCollege: ${formData.collegeName}\nProject: ${formData.projectTitle}\nBudget: ₹${formData.budget}\nDeadline: ${formData.deadline}`
      );
      
      setTimeout(() => {
        window.open(`https://wa.me/919028833275?text=${waMsg}`, "_blank");
        router.push("/#portfolio");
      }, 1500);

    } catch (e) {
      console.error(e);
      toast.error("Failed to register request in registry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-20">
      {/* Friendly hand-drawn planner heading */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#FFF59D] border-2.5 border-[#2C2C2C] text-[#2C2C2C] mb-4 shadow-[2px_3px_0_#2C2C2C] rotate-[-5deg]">
          <ClipboardList className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-hand font-extrabold text-[#2C2C2C]">
          Project Planning Ledger
        </h1>
        <p className="mt-2 text-sm font-marker text-[#6A6A6A] max-w-xl mx-auto">
          Specify your academic blueprint parameters below. Once submitted to our office ledger, our coordinator desk will call you to discuss timelines.
        </p>
      </div>

      {/* Notebook Ruled Card Sheet */}
      <div className="sketch-border bg-[#FCF9F2] p-3 sm:p-6 md:p-10 shadow-[5px_6px_0px_#2C2C2C] notebook-ruled overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10 pl-4 sm:pl-10">
          
          {/* Section A: Student Ledger details */}
          <div>
            <h3 className="text-lg font-marker font-extrabold text-[#2C2C2C] mb-5 underline decoration-2 decoration-[#A5D6A7] flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-[#2C2C2C] shrink-0" />
              [A] Student Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-marker font-extrabold text-[#2C2C2C] mb-1.5 uppercase tracking-wider">Your Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full text-sm px-4 py-3 bg-[#FAF6EE]/60 border-2 border-[#2C2C2C] rounded-xl focus:outline-none focus:bg-[#FFF59D]/20 transition-all text-[#2C2C2C] font-marker"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>

              <div>
                <label className="block text-xs font-marker font-extrabold text-[#2C2C2C] mb-1.5 uppercase tracking-wider">College Name *</label>
                <input
                  type="text"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleInputChange}
                  required
                  className="w-full text-sm px-4 py-3 bg-[#FAF6EE]/60 border-2 border-[#2C2C2C] rounded-xl focus:outline-none focus:bg-[#FFF59D]/20 transition-all text-[#2C2C2C] font-marker"
                  placeholder="e.g. SPIT Mumbai"
                />
              </div>

              <div>
                <label className="block text-xs font-marker font-extrabold text-[#2C2C2C] mb-1.5 uppercase tracking-wider">Branch / Specialization *</label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  required
                  className="w-full text-sm px-4 py-3 bg-[#FAF6EE]/60 border-2 border-[#2C2C2C] rounded-xl focus:outline-none focus:bg-[#FFF59D]/20 transition-all text-[#2C2C2C] font-marker"
                  placeholder="e.g. Computer Engineering"
                />
              </div>

              <div>
                <label className="block text-xs font-marker font-extrabold text-[#2C2C2C] mb-1.5 uppercase tracking-wider">Academic Grade level *</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  className="w-full text-sm px-4 py-3 bg-[#FAF6EE]/60 border-2 border-[#2C2C2C] rounded-xl focus:outline-none focus:bg-[#FFF59D]/20 transition-all text-[#2C2C2C] font-marker"
                >
                  <option value="">Select Academic Year</option>
                  <option value="Diploma 1st Year">Diploma 1st Year</option>
                  <option value="Diploma 2nd Year">Diploma 2nd Year</option>
                  <option value="Diploma Final Year">Diploma Final Year</option>
                  <option value="First Year Engineering">First Year Engineering</option>
                  <option value="Second Year Engineering">Second Year Engineering</option>
                  <option value="Third Year Engineering">Third Year Engineering</option>
                  <option value="Final Year Engineering">Final Year Engineering</option>
                  <option value="BCA / MCA student">BCA / MCA student</option>
                  <option value="M.Tech Candidate">M.Tech Candidate</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-t-2 border-dashed border-[#2C2C2C]/10" />

          {/* Section B: Technical Specs */}
          <div>
            <h3 className="text-lg font-marker font-extrabold text-[#2C2C2C] mb-5 underline decoration-2 decoration-[#90CAF9] flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-[#2C2C2C] shrink-0" />
              [B] Technical Blueprint Specs
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-marker font-extrabold text-[#2C2C2C] mb-1.5 uppercase tracking-wider">Project Concept Title *</label>
                <input
                  type="text"
                  name="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleInputChange}
                  required
                  className="w-full text-sm px-4 py-3 bg-[#FAF6EE]/60 border-2 border-[#2C2C2C] rounded-xl focus:outline-none focus:bg-[#FFF59D]/20 transition-all text-[#2C2C2C] font-marker"
                  placeholder="e.g. AI-based Leaf scanning web application"
                />
              </div>

              <div>
                <label className="block text-xs font-marker font-extrabold text-[#2C2C2C] mb-1.5 uppercase tracking-wider">Preferred Tech Stacks *</label>
                <input
                  type="text"
                  name="techRequired"
                  value={formData.techRequired}
                  onChange={handleInputChange}
                  required
                  className="w-full text-sm px-4 py-3 bg-[#FAF6EE]/60 border-2 border-[#2C2C2C] rounded-xl focus:outline-none focus:bg-[#FFF59D]/20 transition-all text-[#2C2C2C] font-marker"
                  placeholder="e.g. Next.js, FastAPI, OpenCV"
                />
              </div>

              <div>
                <label className="block text-xs font-marker font-extrabold text-[#2C2C2C] mb-1.5 uppercase tracking-wider flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-[#6A6A6A]" />
                  Submission Deadline *
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  required
                  className="w-full text-sm px-4 py-3 bg-[#FAF6EE]/60 border-2 border-[#2C2C2C] rounded-xl focus:outline-none focus:bg-[#FFF59D]/20 transition-all text-[#2C2C2C] font-marker"
                />
              </div>

              <div>
                <label className="block text-xs font-marker font-extrabold text-[#2C2C2C] mb-1.5 uppercase tracking-wider flex items-center">
                  <DollarSign className="w-4 h-4 mr-0.5 text-[#6A6A6A]" />
                  Plan Budget Allocation (₹ INR) *
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  required
                  min="500"
                  step="50"
                  className="w-full text-sm px-4 py-3 bg-[#FAF6EE]/60 border-2 border-[#2C2C2C] rounded-xl focus:outline-none focus:bg-[#FFF59D]/20 transition-all text-[#2C2C2C] font-marker"
                  placeholder="e.g. 3500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-marker font-extrabold text-[#2C2C2C] mb-1.5 uppercase tracking-wider">Logic specifications or Custom outlines</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full text-sm px-4 py-3 bg-[#FAF6EE]/60 border-2 border-[#2C2C2C] rounded-xl focus:outline-none focus:bg-[#FFF59D]/20 transition-all text-[#2C2C2C] font-marker"
                placeholder="Mention any custom dashboard features, specific database views, or local modules..."
              ></textarea>
            </div>
          </div>

          <hr className="border-t-2 border-dashed border-[#2C2C2C]/10" />

          {/* Section C: Deliverables Checkbox */}
          <div>
            <h3 className="text-lg font-marker font-extrabold text-[#2C2C2C] mb-5 underline decoration-2 decoration-[#CE93D8] flex items-center">
              <Layers className="w-5 h-5 mr-2 text-[#2C2C2C] shrink-0" />
              [C] Core Resources Required
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <label className="flex items-center p-4 bg-white hover:bg-[#FAF6EE]/60 border-2 border-[#2C2C2C] rounded-xl cursor-pointer transition-colors shadow-[2px_3px_0_#2C2C2C] active:translate-y-0.5 active:shadow-[1px_1px_0_#2C2C2C]">
                <input
                  type="checkbox"
                  name="needPPT"
                  checked={formData.needPPT}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-[#2C2C2C] border-2 border-[#2C2C2C] rounded focus:ring-0 focus:ring-offset-0 shrink-0 accent-[#2C2C2C]"
                />
                <div className="ml-3 font-marker">
                  <p className="text-sm font-extrabold text-[#2C2C2C]">Presentation slides (PPT)</p>
                  <p className="text-[10px] text-[#6A6A6A] leading-none mt-0.5">Syllabus structure ready</p>
                </div>
              </label>

              <label className="flex items-center p-4 bg-white hover:bg-[#FAF6EE]/60 border-2 border-[#2C2C2C] rounded-xl cursor-pointer transition-colors shadow-[2px_3px_0_#2C2C2C] active:translate-y-0.5 active:shadow-[1px_1px_0_#2C2C2C]">
                <input
                  type="checkbox"
                  name="needReport"
                  checked={formData.needReport}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-[#2C2C2C] border-2 border-[#2C2C2C] rounded focus:ring-0 focus:ring-offset-0 shrink-0 accent-[#2C2C2C]"
                />
                <div className="ml-3 font-marker">
                  <p className="text-sm font-extrabold text-[#2C2C2C]">Comprehensive Report</p>
                  <p className="text-[10px] text-[#6A6A6A] leading-none mt-0.5">Complete layout details</p>
                </div>
              </label>

              <label className="flex items-center p-4 bg-white hover:bg-[#FAF6EE]/60 border-2 border-[#2C2C2C] rounded-xl cursor-pointer transition-colors shadow-[2px_3px_0_#2C2C2C] active:translate-y-0.5 active:shadow-[1px_1px_0_#2C2C2C]">
                <input
                  type="checkbox"
                  name="needVivaGuidance"
                  checked={formData.needVivaGuidance}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-[#2C2C2C] border-2 border-[#2C2C2C] rounded focus:ring-0 focus:ring-offset-0 shrink-0 accent-[#2C2C2C]"
                />
                <div className="ml-3 font-marker">
                  <p className="text-sm font-extrabold text-[#2C2C2C]">Viva Explanations</p>
                  <p className="text-[10px] text-[#6A6A6A] leading-none mt-0.5">Line-by-line review prep</p>
                </div>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-8 border-t-2 border-[#2C2C2C]/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-xs font-marker text-[#6A6A6A] flex items-center">
              <CornerDownRight className="w-4 h-4 mr-1 stroke-2 shrink-0" />
              Filling this ledger sheet automatically syncs parameters to the administrative coordinator desk.
            </p>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-sketch py-4 px-8 text-base w-full sm:w-auto inline-flex items-center justify-center cursor-pointer"
            >
              {loading ? (
                <span className="w-5 h-5 border-2.5 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  Log in Registry
                  <ChevronRight className="w-5 h-5 ml-1 text-[#2C2C2C]" />
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FAF6EE]">
        <div className="w-8 h-8 border-3 border-[#2C2C2C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <OrderForm />
    </Suspense>
  );
}
