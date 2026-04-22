import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";

const STATUS_CONFIG = {
  submitted: {
    class: "status-badge status-submitted",
    label: "Submitted",
    color: "bg-yellow-100 text-yellow-800",
  },
  "in-progress": {
    class: "status-badge status-in-progress",
    label: "In Progress",
    color: "bg-blue-100 text-blue-800",
  },
  resolved: {
    class: "status-badge status-resolved",
    label: "Resolved",
    color: "bg-green-100 text-green-800",
  },
};

const ReportDetail = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, isAdmin } = useAuth();

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancellingReport, setCancellingReport] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  useEffect(() => {
    const fetchReport = async () => {
      if (!reportId) return;

      try {
        setLoading(true);
        const res = await api.get(`/issues/${reportId}`);
        const data = res.data;

        setReport({
          id: data._id,
          title: data.title,
          description: data.description,
          category: data.category,
          location: data.location,
          status: data.status === 'Pending' ? 'submitted' : (data.status === 'In Progress' ? 'in-progress' : 'resolved'),
          createdAt: new Date(data.createdAt),
          reportedBy: typeof data.reporter === 'object' ? data.reporter._id : data.reporter,
          reporterName: typeof data.reporter === 'object' ? data.reporter.name : "Unknown",
          reporterEmail: typeof data.reporter === 'object' ? data.reporter.email : "Unknown",
          imageUrl: data.photoURL ? `http://localhost:5001${data.photoURL}` : undefined,
          feedback: data.feedback
        });
      } catch (err) {
        console.error("Error fetching report:", err);
        setError("Failed to load report details");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!reportId) return;

    try {
      setUpdatingStatus(true);
      
      const backendStatus = newStatus === 'submitted' ? 'Pending' : (newStatus === 'in-progress' ? 'In Progress' : 'Resolved');

      await api.put(`/issues/${reportId}/status`, { status: backendStatus });

      setReport((prev: any) => ({
        ...prev,
        status: newStatus,
      }));

      toast({
        title: "Status updated",
        description: `Report status updated to ${
          newStatus.charAt(0).toUpperCase() + newStatus.slice(1)
        }`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCancelReport = async () => {
    if (!reportId) return;
  
    try {
      setCancellingReport(true);
  
      await api.delete(`/issues/${reportId}`);
  
      toast({
        title: "Report cancelled",
        description: "Your report has been successfully cancelled and deleted",
      });
  
      setShowCancelDialog(false);
      setCancelReason("");
      navigate("/my-reports");
    } catch (error) {
      console.error("Error deleting report:", error);
      toast({
        title: "Error",
        description: "Failed to cancel report. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setCancellingReport(false);
    }
  };
  
  const getStatusColor = (status: string) => {
    const statusConfig =
      STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ||
      STATUS_CONFIG.submitted;
    return statusConfig.color;
  };

  const getStatusLabel = (status: string) => {
    const statusConfig =
      STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ||
      STATUS_CONFIG.submitted;
    return statusConfig.label;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-campus-primary"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container mx-auto max-w-4xl pt-20 px-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-campus-error mb-4">
              {error || "Report not found"}
            </p>
            <Button
              onClick={() => navigate("/my-reports")}
              className="bg-campus-primary hover:bg-campus-primary/90"
            >
              View All Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl pt-20 px-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="border-b">
              <div className="flex justify-between items-start">
                <CardTitle>{report.title}</CardTitle>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    report.status
                  )}`}
                >
                  {getStatusLabel(report.status)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Category
                </h3>
                <p>
                  {report.category.charAt(0).toUpperCase() +
                    report.category.slice(1)}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Description
                </h3>
                <p>{report.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Location
                </h3>
                <p>{report.location}</p>
              </div>

              {report.imageUrl && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Attached Photo
                  </h3>
                  <img
                    src={report.imageUrl}
                    alt="Report"
                    className="rounded-md mt-2 max-h-96 object-contain"
                  />
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Reported By
                </h3>
                <p>{report.reporterName || "Anonymous"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Reported
                </h3>
                <p>
                  {report.createdAt
                    ? formatDistanceToNow(new Date(report.createdAt), {
                        addSuffix: true,
                      })
                    : "Recently"}
                </p>
              </div>
            </CardContent>
          </Card>

          {report.feedback && (
            <Card className="mt-6">
              <CardHeader className="border-b">
                <CardTitle className="text-lg">Feedback</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p>{report.feedback}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Current Status
                  </h3>
                  <p
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      report.status
                    )}`}
                  >
                    {getStatusLabel(report.status)}
                  </p>
                </div>

                {isAdmin && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Update Status
                    </h3>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        disabled={
                          report.status === "submitted" || updatingStatus
                        }
                        onClick={() => handleUpdateStatus("submitted")}
                      >
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium mr-2 ${STATUS_CONFIG.submitted.color}`}
                        >
                          {STATUS_CONFIG.submitted.label}
                        </span>
                        Mark as Submitted
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        disabled={
                          report.status === "in-progress" || updatingStatus
                        }
                        onClick={() => handleUpdateStatus("in-progress")}
                      >
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium mr-2 ${STATUS_CONFIG["in-progress"].color}`}
                        >
                          {STATUS_CONFIG["in-progress"].label}
                        </span>
                        Mark as In Progress
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        disabled={
                          report.status === "resolved" || updatingStatus
                        }
                        onClick={() => handleUpdateStatus("resolved")}
                      >
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium mr-2 ${STATUS_CONFIG.resolved.color}`}
                        >
                          {STATUS_CONFIG.resolved.label}
                        </span>
                        Mark as Resolved
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 flex justify-center">
              {!isAdmin && report.status !== "resolved" && (
                <Button
                  variant="outline"
                  className="w-full mt-2 text-red-500 hover:text-red-600"
                  onClick={() => setShowCancelDialog(true)}
                >
                  Cancel Report
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Report</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this report? This action will
              permanently delete the report.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="cancel-reason">
              Reason for cancellation (optional)
            </Label>
            <Textarea
              id="cancel-reason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Please provide a reason for cancelling this report"
              className="mt-2"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={cancellingReport}
            >
              Keep Report
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelReport}
              disabled={cancellingReport}
            >
              {cancellingReport ? "Cancelling..." : "Cancel Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportDetail;