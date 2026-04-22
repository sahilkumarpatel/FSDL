import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminTeamDetail = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to view this page",
        variant: "destructive"
      });
      navigate('/dashboard');
      return;
    }
    
    // Simulate fetching team details
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [isAdmin, navigate, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-campus-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/admin/teams')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Team Details</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manage Team Members
          </CardTitle>
          <CardDescription>
            View and manage members for team ID: {teamId}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Coming Soon</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-2">
              The team member management functionality is currently under development. Please check back later.
            </p>
            <Button className="mt-6" onClick={() => navigate('/admin/teams')}>
              Return to Teams
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTeamDetail;
