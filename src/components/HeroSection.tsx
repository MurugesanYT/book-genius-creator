
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Wand2 } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="hero-gradient pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-book-purple/10 text-book-purple text-sm font-medium">
              <Wand2 size={16} className="mr-2" />
              <span>AI-Powered Book Creation</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Create Incredible Books with AI in Minutes
            </h1>
            
            <p className="text-lg text-slate-700 md:pr-10">
              Turn your ideas into beautifully crafted books with the power of AI. No writing experience needed - just describe your vision and watch it come to life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth">
                <Button className="btn-accent text-base font-medium flex items-center h-12 px-6">
                  Get Started Free
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="text-base font-medium border-book-purple text-book-purple hover:bg-book-purple/10 flex items-center h-12 px-6">
                  <BookOpen size={18} className="mr-2" />
                  Learn More
                </Button>
              </Link>
            </div>
            
            <div className="pt-4 text-sm text-slate-500">
              No credit card required • Free tier available
            </div>
          </div>
          
          <div className="relative animate-float">
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 border border-slate-200 relative z-10 transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="space-y-4">
                <div className="h-8 w-3/4 bg-book-purple/10 rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-100 rounded"></div>
                  <div className="h-4 bg-slate-100 rounded"></div>
                  <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-100 rounded"></div>
                  <div className="h-4 bg-slate-100 rounded"></div>
                  <div className="h-4 w-4/6 bg-slate-100 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-100 rounded"></div>
                  <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-book-lightPurple/20 rounded-lg transform rotate-6 z-0"></div>
            <div className="absolute inset-0 bg-book-orange/10 rounded-lg transform -rotate-3 z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
