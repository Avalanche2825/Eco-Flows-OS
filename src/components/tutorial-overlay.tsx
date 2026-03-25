"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "./language-provider";
import { X, ChevronRight, ChevronLeft, Lightbulb } from "lucide-react";

const steps = [
  {
    title: "Welcome to EcoFlows OS",
    description: "Your unified platform for tracking real-world energy and water consumption in India.",
    target: "header"
  },
  {
    title: "HydroSolar Analyzer",
    description: "Calculate your solar potential and rainwater harvesting capacity based on your location.",
    target: "hydrosolar"
  },
  {
    title: "GreenGrid Community",
    description: "Join challenges, compete on leaderboards, and connect with other eco-warriors.",
    target: "greengrid"
  },
  {
    title: "Eco Store",
    description: "Spend your earned EcoPoints on real-world eco-friendly products and gadgets.",
    target: "store"
  },
  {
    title: "EcoCity Architect",
    description: "Build India's greenest smart city in our server-authoritative mini-game.",
    target: "ecocity"
  }
];

export function TutorialOverlay() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const tutorialSeen = localStorage.getItem("eco-tutorial-seen");
    if (!tutorialSeen) {
      setIsVisible(true);
    }
  }, []);

  const handleSkip = () => {
    localStorage.setItem("eco-tutorial-seen", "true");
    setIsVisible(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSkip();
    }
  };

  if (!isVisible) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border dark:border-zinc-800 animate-in fade-in zoom-in duration-300">
        <div className="bg-emerald-600 p-8 text-white relative">
          <button 
            onClick={handleSkip}
            title="Skip Tutorial"
            className="absolute top-4 right-4 p-1.5 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex p-3 bg-white/20 rounded-2xl mb-4">
            <Lightbulb className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">{step.title}</h2>
          <p className="text-emerald-100 mt-2">{step.description}</p>
        </div>

        <div className="p-8 flex flex-col items-center gap-6">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div 
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep ? "w-8 bg-emerald-600" : "w-2 bg-zinc-200 dark:bg-zinc-800"
                }`}
              />
            ))}
          </div>

          <div className="flex w-full gap-4">
            <button 
              onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
              disabled={currentStep === 0}
              className="flex-1 h-12 flex items-center justify-center gap-2 font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors disabled:opacity-0"
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>
            <button 
              onClick={handleNext}
              className="flex-[2] h-12 flex items-center justify-center gap-2 font-bold bg-emerald-600 text-white rounded-xl shadow-lg hover:bg-emerald-700 transition-all group"
            >
              {currentStep === steps.length - 1 ? "Get Started!" : "Next Step"}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <button 
            onClick={handleSkip}
            className="text-xs font-semibold text-zinc-400 hover:text-emerald-600 transition-colors"
          >
            Skip tutorial and explore on my own
          </button>
        </div>
      </div>
    </div>
  );
}
