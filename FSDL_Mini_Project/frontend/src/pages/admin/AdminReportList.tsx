import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Search } from 'lucide-react';
import ReportList from '@/components/reports/ReportList';
import { useToast } from '@/components/ui/use-toast';

const AdminReportList = () => {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  
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
  }, [currentUser, navigate, toast, isAdmin]);

  if (!isAdmin) {
    return null; // Will redirect from useEffect
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Reports</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/admin')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="w-full md:w-64 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="search"
            placeholder="Search reports..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm whitespace-nowrap">Filter by:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm whitespace-nowrap">Sort by:</span>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card className="relative">
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportList 
            isAdminView={true} 
            initialSearchTerm={searchTerm} 
            initialStatusFilter={statusFilter}
            initialSortOrder={sortOrder}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReportList;
