"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, User, CalendarDays } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function PatientQueueStatus() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchQueue = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/queue");
      if (!res.ok) throw new Error("Failed to fetch queue data");
      const data = await res.json();
      setQueue(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calculate position
  const totalPatients = queue.length;
  const position =
    queue.findIndex((item) => item.status === "pending") + 1 || totalPatients;
  const progressValue = totalPatients
    ? ((totalPatients - position + 1) / totalPatients) * 100
    : 0;

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
          Your Queue Status
        </h1>
        <p className="text-gray-500">
          Stay updated on your position and wait time
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-100 shadow-md hover:shadow-lg transition">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Patients Ahead</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-700">
              {Math.max(position - 1, 0)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 shadow-md hover:shadow-lg transition">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Your Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={queue[position - 1]?.status === "pending" ? "secondary" : "outline"}
              className="text-base px-3 py-1"
            >
              {queue[position - 1]?.status || "N/A"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      {totalPatients > 0 && (
        <Card className="p-6 shadow-md">
          <h2 className="text-lg font-medium mb-2">Progress</h2>
          <Progress value={progressValue} className="h-3" />
          <p className="mt-2 text-sm text-gray-600 text-center">
            You are <span className="font-semibold">{position}</span> of{" "}
            <span className="font-semibold">{totalPatients}</span> patients
          </p>
        </Card>
      )}

      {/* Queue List */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Queue List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-6">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : queue.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No patients in the queue
            </p>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {queue
                  .sort(
                    (a, b) => new Date(a.created_at) - new Date(b.created_at)
                  )
                  .map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className={`p-4 flex items-center justify-between transition 
                        ${index + 1 === position ? "border border-blue-500 shadow-md" : ""}
                        hover:scale-[1.02] cursor-pointer`}>
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-gray-500" />
                          <div>
                            <h3 className="font-medium">{item.patient_name}</h3>
                            <p className="text-sm text-gray-600">
                              {item.doctor_name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              item.status === "pending" ? "secondary" : "outline"
                            }
                          >
                            {item.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Position: {index + 1}
                          </span>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info alert */}
      <Alert className="bg-blue-50 border border-blue-200">
        <Clock className="w-4 h-4 text-blue-500" />
        <AlertDescription>
          This page auto-refreshes every minute. Last update:{" "}
          <span className="font-medium">
            {new Date().toLocaleTimeString()}
          </span>
        </AlertDescription>
      </Alert>

      {/* Quick actions */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={fetchQueue}
          variant="outline"
          disabled={refreshing}
          className="flex items-center"
        >
          {refreshing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            "Refresh Now"
          )}
        </Button>
        <Button className="bg-gradient-to-br from-blue-500 to-emerald-100">
          <CalendarDays className="w-4 h-4 mr-2 bg-black" />
          View Appointment Details 
        </Button>
      </div>
    </div>
  );
}
