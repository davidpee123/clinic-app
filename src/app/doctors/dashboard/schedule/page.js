"use client";

import { useEffect, useState, useMemo } from "react"; // 👈 IMPORT useMemo
import { supabase } from "@/lib/supabase/client";

export default function SchedulePage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [doctorId, setDoctorId] = useState(null);

  // 1. FIX: Use useMemo to ensure these Date objects are stable across renders
  const { todayStart, todayEnd } = useMemo(() => {
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    return { todayStart: start, todayEnd: end };
  }, []); // 👈 Empty array ensures memoization (only runs once)


  // STEP 1 — get doctorId
  useEffect(() => {
    // ... (logic remains the same)
    const loadUser = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setError("Unable to authenticate doctor.");
        setLoading(false);
        return;
      }
      setDoctorId(user.id);
    };

    loadUser();
  }, []);

  // STEP 2 — fetch TODAY's appointments for this doctor (FIXED)
  useEffect(() => {
    // 2. IMPORTANT: We must also convert the Date objects to ISO strings *here*
    //    and only rely on the primitive string values in the dependency array.
    const todayStartString = todayStart.toISOString();
    const todayEndString = todayEnd.toISOString();

    if (!doctorId) return;

    const loadAppointments = async () => {
      setLoading(true);
      setError("");

      const { data, error: dbError } = await supabase
        .from("appointments")
        .select("id, patient_name, start_time, end_time, video_link")
        .eq("doctor_id", doctorId)
        .gte("start_time", todayStartString)
        .lt("start_time", todayEndString)
        .order("start_time", { ascending: true });

      if (dbError) {
        setError(dbError.message);
      } else {
        setAppointments(data);
      }

      setLoading(false);
    };

    loadAppointments();
    // 3. FIX: Use the stable string primitives in the dependency array
  }, [doctorId, todayStart, todayEnd]); // This is still okay because todayStart and todayEnd are stable objects now.
  // OR, for maximum safety, you could use the string primitives:
  // }, [doctorId, todayStart.toISOString(), todayEnd.toISOString()]);
  // The first approach with useMemo is generally cleaner.

  // ... (rest of the component's return logic)
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* ... (render logic remains the same) */}
      <h2 className="text-2xl font-bold mb-6">Today’s Schedule</h2>

      {loading && <p className="text-blue-600">Loading appointments...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && appointments.length === 0 && (
        <p className="text-gray-600">No appointments for today.</p>
      )}

      <ul className="space-y-4">
        {appointments.map((appt) => (
          <li
            key={appt.id}
            className="p-4 bg-gray-50 hover:bg-gray-100 transition shadow-sm rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-gray-800">{appt.patient_name}</p>
              <p className="text-sm text-gray-500">
                {new Date(appt.start_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" — "}
                {new Date(appt.end_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {appt.video_link ? (
              <a
                href={appt.video_link}
                target="_blank"
                className="px-4 py-1 text-sm text-white bg-blue-500 rounded-full hover:bg-blue-600"
              >
                Join Video Call
              </a>
            ) : (
              <span className="px-4 py-1 text-sm bg-gray-300 rounded-full">
                Physical Visit
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}