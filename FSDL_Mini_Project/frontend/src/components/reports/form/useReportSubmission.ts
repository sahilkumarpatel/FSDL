import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';

export const useReportSubmission = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Status state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const refreshBucketCheck = async () => {
    // no-op for backward compatibility in the component
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category || !location) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('location', location);
      if (image) {
        formData.append('photo', image);
      }
      
      const res = await api.post('/issues', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast({
        title: "Report submitted",
        description: "Your issue has been reported successfully!",
      });
      
      navigate('/my-reports');
    } catch (error: any) {
      console.error('Error submitting report:', error);
      toast({
        title: "Error",
        description: `Failed to submit report: ${error.response?.data?.error || error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    location,
    setLocation,
    image,
    setImage,
    imagePreview,
    setImagePreview,
    isSubmitting,
    rlsError: false,
    tableError: false,
    storageError: false,
    isMissingSupabaseConfig: false,
    handleSubmit,
    refreshBucketCheck
  };
};
