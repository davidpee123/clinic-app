"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import {
  Heart,
  Clock,
  Calendar,
  User,
  Phone,
  Mail,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Create client (client-side) — uses NEXT_PUBLIC_ env vars
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// small date formatting helpers
function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
function formatTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export default function PatientPortalPage() {
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState(null);
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      setLoading(true);
      try {
        // 1) Get auth session / user
        const {
          data: { session, user },
          error: userErr,
        } = await supabase.auth.getSession();

        if (userErr) throw userErr;

        const loggedUser = session?.user || user || null;
        if (!loggedUser) {
          // not logged in
          setAuthUser(null);
          setLoading(false);
          return;
        }
        if (!mounted) return;
        setAuthUser(loggedUser);

        // 2) Fetch patient row by user_id OR email (common patterns)
        // Try by user_id first if you store it, otherwise fallback to email lookup.
        let patientRow = null;

        // try find by user_id column
        let { data: pById, error: pErr } = await supabase
          .from("patients")
          .select("*")
          .eq("user_id", loggedUser.id)
          .limit(1)
          .maybeSingle();

        if (pErr) {
          console.warn("lookup by user_id error (non-fatal):", pErr.message || pErr);
        }
        if (pById) patientRow = pById;

        // fallback: lookup by email if patientRow not found
        if (!patientRow && loggedUser.email) {
          const { data: pByEmail, error: pEmailErr } = await supabase
            .from("patients")
            .select("*")
            .eq("email", loggedUser.email)
            .limit(1)
            .maybeSingle();
          if (pEmailErr) console.warn("lookup by email error (non-fatal):", pEmailErr.message || pEmailErr);
          if (pByEmail) patientRow = pByEmail;
        }

        if (!patientRow) {
          // No patient record matched — show friendly error
          setPatient(null);
          setError("No patient record linked to this account. Please register or contact support.");
          setLoading(false);
          return;
        }

        if (!mounted) return;
        setPatient(patientRow);

        // 3) Fetch appointments for this patient
        // assuming appointments table has patient_id or patient_email field
        // try patient_id first, fallback to patient email
        let apptQuery = supabase
          .from("appointments")
          .select("*")
          .order("appointment_date", { ascending: true });
        if (loggedUser?.id) {
          apptQuery = apptQuery.eq("user_id", loggedUser.id);
        } else if (patientRow.id) {
          apptQuery = apptQuery.eq("patient_id", patientRow.id);
        } else if (patientRow.email) {
          apptQuery = apptQuery.eq("patient_email", patientRow.email);
        } else {
          apptQuery = apptQuery.eq("patient_name", patientRow.full_name);
        }

        const { data: appts, error: apptErr } = await apptQuery;
        if (apptErr) {
          console.warn("appointments fetch error:", apptErr);
          setAppointments([]);
        } else {
          // normalize and sort upcoming-first
          const normalized = (appts || []).map((a) => ({
            id: a.id,
            date: a.appointment_date || a.note || a.date || null,
            time: a.appointment_time || (a.appointment_date ? a.appointment_date : null),
            doctor: a.doctor_name ? { name: a.doctor_name } : a.doctor || { name: "—" },
            reason: a.reason_for_visit || a.reason || "Consultation",
            status: a.status || "upcoming",
            raw: a,
          }));
          normalized.sort((x, y) => {
            const dx = new Date(x.date || x.time || 0).getTime();
            const dy = new Date(y.date || y.time || 0).getTime();
            return dx - dy;
          });
          setAppointments(normalized);
        }

        setError(null);
      } catch (err) {
        console.error("Patient portal load error:", err);
        setError(err?.message || "Failed to load patient data.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, []);

  // cancel appointment (local optimistic + server)
  async function cancelAppointment(apptId) {
    if (!confirm("Cancel this appointment?")) return;
    try {
      // optimistic UI
      setAppointments((prev) => prev.filter((a) => a.id !== apptId));

      // call server: delete or update appointment status
      const { error: delErr } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", apptId);

      if (delErr) {
        alert("Could not cancel appointment (server). Reverting.");
        // reload list
        location.reload();
      } else {
        alert("Appointment cancelled.");
      }
    } catch (e) {
      console.error(e);
      alert("Error cancelling appointment.");
      location.reload();
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin mb-4 inline-block rounded-full h-10 w-10 border-4 border-t-blue-600 border-gray-200"></div>
          <p className="text-gray-600">Loading your patient dashboard…</p>
        </div>
      </div>
    );
  }

  // Not logged in or no patient found
  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full text-center p-6">
          <CardHeader>
            <CardTitle className="text-2xl">Not Signed In</CardTitle>
            <CardDescription>Please sign in to access your patient portal.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/login">Go to Login</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-lg w-full p-6 text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-rose-600">Access Issue</CardTitle>
            <CardDescription className="text-gray-600 mt-2">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <Link href="/register">Register Patient</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/support">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // derive next appointment
  const nextAppointment = appointments.find((a) => {
    const dt = new Date(a.date || a.time || null);
    return !isNaN(dt) && dt >= new Date();
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">MediCare Clinic</div>
                <div className="text-xs text-gray-500">Patient Portal</div>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-700 hidden sm:block">Signed in as <span className="font-semibold">{authUser.email}</span></div>
              <Button
                variant="ghost"
                onClick={async () => {
                  await supabase.auth.signOut();
                  location.href = "/";
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Profile card */}
          <aside>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{patient.full_name || patient.firstName || "Patient"}</div>
                    <div className="text-sm text-gray-500">{patient.email}</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" /> <span>{patient.phone || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" /> <span>{patient.date_of_birth ? formatDate(patient.date_of_birth) : "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" /> <span>{patient.email}</span>
                  </div>

                  <Separator />

                  <div>
                    <div className="text-xs text-gray-500">Quick actions</div>
                    <div className="flex gap-2 mt-3">
                      <Button asChild size="sm" className="w-full">
                        <Link href="/book-appointment">Book</Link>
                      </Button>
                      <Button onClick={() => location.reload()} variant="outline" size="sm" className="w-full bg-blue-500">
                        Refresh
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Middle: main dashboard */}
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant="secondary">Welcome</Badge>
                  <h2 className="text-2xl font-bold mt-2">Hello, {patient.full_name?.split(" ")[0] || "there"} 👋</h2>
                  <p className="text-gray-600 mt-1">Here is your personal health overview.</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Member since</div>
                  <div className="font-semibold">{patient.created_at ? formatDate(patient.created_at) : "—"}</div>
                </div>
              </div>
            </div>

            {/* Next appointment */}
            <div>
              <h3 className="text-lg font-semibold mb-3 ">Next appointment</h3>
              {nextAppointment ? (
                <Card className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Date</div>
                      <div className="font-semibold">{formatDate(nextAppointment.date)}</div>
                      <div className="text-sm text-gray-500">{formatTime(nextAppointment.time)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Doctor</div>
                      <div className="font-semibold">{nextAppointment.doctor.name}</div>
                      <div className="text-sm text-gray-500 mt-2">{nextAppointment.reason}</div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Button className="bg-blue-500" asChild size="sm">
                      <Link href={`/patient-portal/reschedule/${nextAppointment.id}`}>Reschedule</Link>
                    </Button>
                    <Button onClick={() => cancelAppointment(nextAppointment.id)} variant="destructive" size="sm">
                      Cancel
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="p-6 text-center">
                  <div className="text-gray-600">No upcoming appointments</div>
                  <div className="mt-3">
                    <Button asChild>
                      <Link href="/book-appointment">Book an appointment</Link>
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {/* All appointments */}
            <div>
              <h3 className="text-lg font-semibold mb-3">All appointments</h3>
              {appointments.length === 0 ? (
                <Card className="p-6 text-center">
                  <div className="text-gray-600">You have no appointments yet.</div>
                </Card>
              ) : (
                <div className="space-y-3">
                  {appointments.map((a) => (
                    <Card key={a.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{formatDate(a.date)}</div>
                          <div className="text-sm text-gray-500">{formatTime(a.time)}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{a.doctor.name}</div>
                          <div className="text-sm text-gray-500">{a.reason}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2 justify-end">
                        <Button className= "bg-blue-500"asChild size="sm" variant="outline">
                          <Link href={`/patient-portal/reschedule/${a.id}`}>Reschedule</Link>
                        </Button>
                        <Button onClick={() => cancelAppointment(a.id)} variant="destructive" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
