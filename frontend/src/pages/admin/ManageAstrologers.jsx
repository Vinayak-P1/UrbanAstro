import React, { useEffect, useState } from "react";
import { UserPlus, Trash2, Award, Briefcase, FileText, Image as ImageIcon } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "";

const ManageAstrologers = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: "", expertise: "", experience: "", bio: "" });
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("token");

  const fetchList = async () => {
    const r = await fetch(`${API}/api/astrologers`);
    const j = await r.json();
    setList(j.items || []);
  };

  useEffect(() => {
    fetchList();
  }, []);

  const create = async () => {
    if (!form.name || !form.expertise) {
      alert("Name and expertise are required");
      return;
    }
    const fd = new FormData();
    Object.entries({
      ...form,
      experience: Number(form.experience),
    }).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append("image", file);

    const r = await fetch(`${API}/api/astrologers`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    const j = await r.json();
    if (j.success) {
      setForm({ name: "", expertise: "", experience: "", bio: "" });
      setFile(null);
      fetchList();
      alert("Astrologer added");
    } else {
      alert(j.error || "Failed");
    }
  };

  const removeAstrologer = async (id) => {
    if (!confirm("Delete this astrologer? This will remove them from the main site.")) return;
    try {
      const res = await fetch(`${API}/api/astrologers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const j = await res.json();
      if (res.ok && j.success) {
        alert("Astrologer deleted");
        fetchList();
      } else {
        alert(j.error || "Failed to delete");
      }
    } catch (e) {
      console.error("Delete error:", e);
      alert("Server error");
    }
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
            <span className="text">Management</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-extrabold text-white"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Manage <span className="text-[#7C3AED]">Astrologers</span>
          </h1>
        </div>

        {/* Add Astrologer Form */}
        <div className="ua-card p-6 mb-8 animate-fade-up">
          <h2
            className="text-lg font-bold text-white mb-4 flex items-center gap-2"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <UserPlus className="w-5 h-5 text-[#7C3AED]" />
            Add New Astrologer
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              className="bg-white/[0.04] border border-white/[0.08] p-3 rounded-xl text-white placeholder-white/25 focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 outline-none text-sm"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="bg-white/[0.04] border border-white/[0.08] p-3 rounded-xl text-white placeholder-white/25 focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 outline-none text-sm"
              placeholder="Expertise (e.g. Vedic, KP, Tarot)"
              value={form.expertise}
              onChange={(e) => setForm({ ...form, expertise: e.target.value })}
            />
            <input
              className="bg-white/[0.04] border border-white/[0.08] p-3 rounded-xl text-white placeholder-white/25 focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 outline-none text-sm"
              placeholder="Experience (years)"
              type="number"
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
            />
            <input
              className="bg-white/[0.04] border border-white/[0.08] p-3 rounded-xl text-white placeholder-white/25 focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 outline-none text-sm"
              placeholder="Short Bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
            <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="bg-white/[0.04] border border-white/[0.08] p-2.5 rounded-xl text-xs text-white/70 w-full flex-1"
              />
              <button
                onClick={create}
                className="ua-btn-primary w-full sm:w-auto justify-center text-sm py-3 px-6 shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                Add Astrologer
              </button>
            </div>
          </div>
        </div>

        {/* Astrologers List */}
        <div className="grid md:grid-cols-3 gap-4">
          {list.map((a) => (
            <div key={a._id} className="ua-card p-5 relative group hover:border-white/20 transition-all">
              <img
                src={a.imageUrl}
                alt={a.name}
                className="w-full h-44 object-cover rounded-xl mb-3 border border-white/[0.08]"
              />
              <div className="font-bold text-white text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {a.name}
              </div>
              <div className="text-xs text-[#22D3EE] font-medium mt-0.5">
                {a.expertise} · {a.experience} yrs exp
              </div>
              <div className="text-xs text-white/50 mt-2 leading-relaxed line-clamp-3">
                {a.bio}
              </div>
              <button
                onClick={() => removeAstrologer(a._id)}
                className="absolute top-3 right-3 p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                title="Delete Astrologer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageAstrologers;
