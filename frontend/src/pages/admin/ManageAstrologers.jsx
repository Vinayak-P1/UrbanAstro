import React, { useEffect, useState } from "react";
import { TiDelete } from "react-icons/ti";
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

  useEffect(() => { fetchList(); }, []);

 const create = async () => {
  const fd = new FormData();
  Object.entries({
    ...form,
    experience: Number(form.experience), // 👈 convert here
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
    <div className="min-h-screen bg-[#0B0B1A] text-white pt-24 md:pt-28 lg:pt-32 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Manage Astrologers</h1>

        <div className="bg-white/10 p-4 rounded mb-6 grid gap-3 md:grid-cols-2">
        <input className="bg-black/30 p-2 rounded" placeholder="Name"
               value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <input className="bg-black/30 p-2 rounded" placeholder="Expertise"
               value={form.expertise} onChange={e=>setForm({...form,expertise:e.target.value})}/>
        <input className="bg-black/30 p-2 rounded" placeholder="Experience (years)"  type="number"
               value={form.experience} onChange={e=>setForm({...form,experience:e.target.value})}/>
        <input className="bg-black/30 p-2 rounded" placeholder="Short Bio"
               value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})}/>
        <input type="file" onChange={(e)=>setFile(e.target.files[0])}/>
        <button onClick={create} className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded">Add Astrologer</button>
      </div>

        <div className="grid md:grid-cols-3 gap-4">
        {list.map(a => (
          <div key={a._id} className="p-4 bg-white/10 rounded relative">
            <img src={a.imageUrl} className="w-full h-40 object-cover rounded mb-2" />
            <div className="font-bold">{a.name}</div>
            <div className="text-sm text-gray-300">{a.expertise} · {a.experience} yrs</div>
            <div className="text-sm mt-1">{a.bio}</div>
            <div className="absolute top-3 right-3 flex gap-2">
             
              <button onClick={()=>removeAstrologer(a._id)} className="bg-red-600 px-2 py-1 rounded text-sm"><TiDelete /></button>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default ManageAstrologers;
