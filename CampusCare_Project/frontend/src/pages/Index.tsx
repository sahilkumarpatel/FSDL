import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

// Lazy load the heavy 3D scene so the main website opens instantly
const CollegeScene = lazy(() => import('@/components/3d/CollegeScene'));

const Index = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-campus-light via-white to-blue-50 overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative">
        {/* Navigation */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center relative z-10"
        >
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-campus-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              C
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Campus<span className="text-campus-primary">Care</span></h1>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-campus-primary transition-colors">
              Log in
            </Link>
            <Button className="bg-campus-primary hover:bg-campus-primary/90 shadow-md rounded-full px-6" asChild>
              <Link to="/register">Sign Up</Link>
            </Button>
          </div>
        </motion.header>

        {/* Hero Section */}
        <main className="mt-16 md:mt-24 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          
          {/* Text Content */}
          <motion.div 
            className="w-full lg:w-1/2 max-w-2xl z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-campus-primary text-sm font-medium mb-6">
              <ShieldCheck className="h-4 w-4" />
              <span>Smart Campus Issue Tracking</span>
            </motion.div>
            
            <motion.h2 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] text-gray-900 tracking-tight">
              Your Voice, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-campus-primary to-blue-400">
                Our Solution
              </span>
            </motion.h2>
            
            <motion.p variants={itemVariants} className="mt-6 text-xl text-gray-600 leading-relaxed max-w-lg">
              Report, track, and resolve campus issues in real-time. From broken infrastructure to IT concerns, we make your college experience seamless.
            </motion.p>
            
            <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-campus-primary hover:bg-campus-primary/90 text-lg h-14 px-8 rounded-full shadow-xl shadow-blue-200 transition-transform hover:scale-105" asChild>
                <Link to="/register">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-14 px-8 rounded-full border-2 hover:bg-gray-50 transition-transform hover:scale-105" asChild>
                <Link to="/login">
                  View Dashboard
                </Link>
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-12 flex items-center gap-8 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-campus-primary" />
                <span>Fast Resolution</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-campus-primary" />
                <span>Precise Tracking</span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* 3D Scene */}
          <motion.div 
            className="w-full lg:w-1/2 relative flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          >
            {/* Decorative background blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/50 rounded-full blur-3xl -z-10" />
            
            {/* React Three Fiber Canvas with Lazy Loading */}
            <Suspense fallback={
              <div className="w-full h-[400px] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full border-4 border-campus-primary border-t-transparent animate-spin"></div>
                  <p className="mt-4 text-sm text-campus-primary font-medium">Loading 3D Experience...</p>
                </div>
              </div>
            }>
              <CollegeScene />
            </Suspense>
          </motion.div>
          
        </main>
      </div>
    </div>
  );
};

export default Index;
