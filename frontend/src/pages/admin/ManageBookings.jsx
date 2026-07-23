import React, { useEffect, useState } from "react";
import { FileText, CheckCircle2, XCircle, Trash2, ExternalLink, UploadCloud, User, Phone, Mail, Calendar, Clock, MapPin, Crown, Zap, ShieldCheck } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "";

/* Robust PDF opener: fetches the file and opens a blob URL in a new tab. */
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

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [fileMap, setFileMap] = useState({});
  const token = localStorage.getItem("token");

  const fetchBookings = async () => {
    const res = await fetch(`${API}/api/bookings/admin/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setBookings(data.items || []);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleFileChange = (bookingId, file) => {
    setFileMap((prev) => ({ ...prev, [bookingId]: file }));
  };

  const uploadReport = async (bookingId) => {
    const file = fileMap[bookingId];
    if (!file) return alert("Select a PDF first!");
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(`${API}/api/bookings/${bookingId}/report/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    const data = await res.json();
    if (data.success) {
      alert("Report uploaded successfully!");
      fetchBookings();
    } else {
      alert(data.error || "Error uploading report");
    }
  };

  const approveBooking = async (bookingId) => {
    if (!confirm("Approve this booking (UTR verified)?")) return;
    const res = await fetch(`${API}/api/bookings/${bookingId}/approve`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    const j = await res.json();
    if (j.success) {
      alert("Booking approved. It is now In Progress.");
      fetchBookings();
    } else alert(j.error || "Approve failed");
  };

  const disapproveBooking = async (bookingId) => {
    if (!confirm("Disapprove this booking (UTR mismatch)?")) return;
    const res = await fetch(`${API}/api/bookings/${bookingId}/disapprove`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    const j = await res.json();
    if (j.success) {
      alert("Booking disapproved.");
      fetchBookings();
    } else alert(j.error || "Disapprove failed");
  };

  const deleteReport = async (bookingId) => {
    if (!confirm("Delete this report? You will be able to upload a new one.")) return;
    const res = await fetch(`${API}/api/bookings/${bookingId}/report/delete`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const j = await res.json();
    if (j.success) {
      alert("Report deleted successfully. You can now upload a new one.");
      fetchBookings();
    } else alert(j.error || "Delete failed");
  };

  return (
    <div className="min-h-screen font-display text-white pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 lg:px-8 py-8 relative overflow-hidden">
      {/* ── Glow Blobs ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/8 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="mb-8 animate-fade-up">
          <div className="ua-section-label mb-3">
            <span className="dot" />
            <span className="text">Bookings</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-extrabold text-white"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            User <span className="text-[#7C3AED]">Bookings & Reports</span>
          </h1>
        </div>

        {bookings.map((b) => (
          <div key={b._id} className="ua-card p-6 mb-4 relative hover:border-white/20 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <User className="w-4 h-4 text-[#7C3AED]" />
                {b.name}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
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
                {b.refSource && (
                  <span className="text-xs bg-white/[0.06] border border-white/[0.08] px-2.5 py-0.5 rounded-full text-white/60">
                    QR: {b.refSource}
                  </span>
                )}
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    b.status === "completed"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : b.status === "paid" || b.status === "inprogress"
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  {b.status}
                </span>
              </div>
            </div>

            {/* User Contact & Birth Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white/[0.03] p-3.5 rounded-xl border border-white/[0.06] text-xs text-white/60 mb-4">
              <div>
                <span className="text-white/40 block mb-0.5">Phone:</span>
                <span className="font-mono font-semibold text-emerald-400">{b.phone || b.user?.phone || "No Phone"}</span>
              </div>
              <div>
                <span className="text-white/40 block mb-0.5">Email:</span>
                <span className="font-semibold text-white truncate block">{b.email || b.user?.email || "No Email"}</span>
              </div>
              <div>
                <span className="text-white/40 block mb-0.5">Birth Date & Time:</span>
                <span className="font-semibold text-white">{b.birthDate || "N/A"} · {b.birthTime || (b.unknownTime ? "Unknown" : "N/A")}</span>
              </div>
              <div>
                <span className="text-white/40 block mb-0.5">Birth Location:</span>
                <span className="font-semibold text-white">{b.birthLocation || "N/A"}</span>
              </div>
            </div>

            {/* Submitted Questions */}
            <div className="mb-4">
              <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block mb-1.5">
                Submitted Questions:
              </span>
              <div className="bg-white/[0.02] p-3.5 rounded-xl border border-white/[0.06] whitespace-pre-wrap text-sm text-white/80 leading-relaxed font-sans">
                {b.question || "N/A"}
              </div>
            </div>

            {/* Life Areas */}
            {b.selectedLifeAreas && b.selectedLifeAreas.length > 0 && (
              <div className="mb-4 text-xs text-white/50">
                Selected Areas: <span className="text-white font-medium">{b.selectedLifeAreas.join(", ")}</span>
              </div>
            )}

            {/* Transaction ID & Screenshot */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/60 mb-4 border-t border-white/[0.06] pt-3">
              {b.utr && (
                <div>
                  Transaction ID / UTR: <span className="font-mono text-white font-semibold">{b.utr}</span>
                </div>
              )}
              {b.screenshot && (
                <div>
                  <a
                    href={b.screenshot}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#22D3EE] hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View Payment Screenshot Proof
                  </a>
                </div>
              )}
            </div>

            {/* Report Actions */}
            {b.report ? (
              <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                <button
                  onClick={() => {
                    fetch(`${API}/api/bookings/report/view/${b._id}`, {
                      headers: { Authorization: `Bearer ${token}` },
                    })
                      .then((r) => r.json())
                      .then((data) => {
                        if (data.fileUrl) {
                          openPdfUrlInNewTab(data.fileUrl, { Authorization: `Bearer ${token}` });
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
                  View PDF Report
                </button>
                <button
                  onClick={() => deleteReport(b._id)}
                  className="px-3.5 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 text-xs font-semibold transition-all"
                >
                  Delete & Re-upload
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-white/[0.06]">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(b._id, e.target.files[0])}
                  className="bg-white/[0.04] border border-white/[0.08] p-2.5 rounded-xl text-xs text-white/70 w-full"
                />
                <button
                  onClick={() => uploadReport(b._id)}
                  className="ua-btn-primary py-2.5 px-5 text-xs whitespace-nowrap shrink-0 justify-center w-full sm:w-auto"
                >
                  <UploadCloud className="w-4 h-4" />
                  Upload PDF & Complete
                </button>
              </div>
            )}

            {/* Approval / Disapproval for awaiting_verification */}
            {b.status === "awaiting_verification" && (
              <div className="flex gap-3 mt-4 pt-3 border-t border-white/[0.06]">
                <button
                  onClick={() => approveBooking(b._id)}
                  className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve Payment
                </button>
                <button
                  onClick={() => disapproveBooking(b._id)}
                  className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <XCircle className="w-4 h-4" /> Disapprove
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageBookings;