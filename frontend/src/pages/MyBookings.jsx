import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ExternalLink, Calendar, Plus, Crown, Zap, Clock, ShieldCheck, AlertCircle } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "";

/* Reuse same robust PDF opener as admin page */
async function openPdfUrlInNewTab(url, headers = {}) {
  try {
    const resp = await fetch(url, { headers });
    if (!resp.ok) {
      window.open(url, "_blank");
      return;
    }
    const buffer = await resp.arrayBuffer();
    const blob = new Blob([buffer], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60 * 1000);
  } catch (e) {
    console.error("openPdfUrlInNewTab error:", e);
    window.open(url, "_blank");
  }
}

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    (async () => {
      const res = await fetch(`${API}/api/bookings/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setBookings(data.items || []);
      else alert(data.error || "Failed to fetch bookings");
    })();
  }, []);

  const badge = (s) => {
    if (s === "completed")
      return <span className="ua-badge ua-badge-success">Completed</span>;
    if (s === "inprogress" || s === "paid")
      return <span className="ua-badge ua-badge-warning">In Progress</span>;
    if (s === "awaiting_verification")
      return <span className="ua-badge ua-badge-accent">Awaiting Verification</span>;
    if (s === "pending")
      return <span className="ua-badge ua-badge-warning">Pending</span>;
    if (s === "disapproved")
      return <span className="ua-badge" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", borderColor: "rgba(239,68,68,0.2)" }}>Disapproved</span>;
    return <span className="ua-badge ua-badge-default">{s}</span>;
  };

  return (
    <div className="font-display text-gray-200 min-h-screen flex flex-col items-center pt-24 p-6 relative overflow-hidden">
      {/* ── Glow Blobs ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/8 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-xl flex flex-col items-center">
        <div className="text-center mb-8 animate-fade-up">
          <div className="ua-section-label mb-3">
            <span className="dot" />
            <span className="text">Dashboard</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-white"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            My <span className="text-[#7C3AED]">Consultations</span>
          </h2>
        </div>

        {bookings.length === 0 ? (
          <div className="ua-card p-10 text-center w-full animate-fade-up">
            <Calendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-base mb-6">No bookings found yet.</p>
            <button
              onClick={() => navigate("/consultation")}
              className="ua-btn-primary mx-auto"
            >
              <Plus className="w-4 h-4" />
              Start New Consultation
            </button>
          </div>
        ) : (
          <div className="w-full space-y-4">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="ua-card p-5 sm:p-6 transition-all duration-300 hover:border-white/20 animate-fade-up"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        b.plan === "premium"
                          ? "bg-[#7C3AED]/20 text-[#22D3EE] border border-[#7C3AED]/30"
                          : "bg-white/[0.06] text-white/70 border border-white/[0.08]"
                      }`}
                    >
                      {b.plan === "premium" ? (
                        <>
                          <Crown className="w-3 h-3 text-[#22D3EE]" /> Premium
                        </>
                      ) : (
                        <>
                          <Zap className="w-3 h-3 text-white/50" /> Starter
                        </>
                      )}
                    </span>
                  </div>
                  {badge(b.status)}
                </div>

                <div className="mb-3">
                  <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block mb-1.5">
                    My Questions:
                  </span>
                  <div className="whitespace-pre-wrap text-sm text-white/80 bg-white/[0.03] p-3.5 rounded-xl border border-white/[0.06] leading-relaxed">
                    {b.question || "General Reading"}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs text-white/40">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-white/30" />
                    {new Date(b.createdAt).toLocaleDateString()}
                  </span>
                  <span className="font-semibold text-white">
                    Amount: ₹{(b.amount / 100).toFixed(0)}
                  </span>
                </div>

                {b.report && (
                  <div className="mt-4 pt-3 border-t border-white/[0.06]">
                    <button
                      onClick={() => {
                        const token = localStorage.getItem("token") || "";
                        fetch(`${API}/api/bookings/report/view/${b._id}`, {
                          headers: token
                            ? { Authorization: `Bearer ${token}` }
                            : {},
                        })
                          .then((r) => r.json())
                          .then((data) => {
                            if (data.fileUrl) {
                              openPdfUrlInNewTab(
                                data.fileUrl,
                                token
                                  ? { Authorization: `Bearer ${token}` }
                                  : {}
                              );
                            } else {
                              alert(data.error || "Failed to load report");
                            }
                          })
                          .catch((e) => {
                            console.error("Fetch error:", e);
                            alert("Error: " + e.message);
                          });
                      }}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#22D3EE] hover:underline"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View Report PDF</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            <div className="pt-4 text-center">
              <button
                onClick={() => navigate("/consultation")}
                className="ua-btn-primary"
              >
                <Plus className="w-4 h-4" />
                Start New Consultation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;