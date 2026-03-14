"use client";

import React, { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { 
  Shield, 
  User, 
  Stethoscope, 
  Phone, 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  Edit3, 
  AlertCircle 
} from "lucide-react";

const CONDS = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Heart Disease",
  "Epilepsy",
  "Thyroid"
];

export default function MedAlertApp() {
  const [step, setStep] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [isEmergencyView, setIsEmergencyView] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    blood: "",
    allergies: "",
    meds: "",
    notes: "",
    c1name: "",
    c1phone: "",
    c2name: "",
    c2phone: "",
    docname: "",
    docphone: "",
  });

  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const qrRef = useRef<HTMLDivElement>(null);

  // Check for URL data (Mocking the emergency view logic)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("d")) {
      setIsEmergencyView(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const toggleCondition = (cond: string) => {
    setSelectedConditions(prev => 
      prev.includes(cond) ? prev.filter(c => c !== cond) : [...prev, cond]
    );
  };

  const validateAndNext = (nextStep: number) => {
    if (step === 0 && nextStep === 1) {
      if (!formData.name) { alert("Name bharo!"); return; }
      if (!formData.blood) { alert("Blood group select karo!"); return; }
    }
    setStep(nextStep);
    setShowQR(false);
  };

  const buildText = () => {
    const lines = [
      "=== SOS EMERGENCY ===",
      `Name: ${formData.name}`,
      formData.age ? `Age: ${formData.age}` : null,
      formData.blood ? `Blood: ${formData.blood}` : null,
      "---",
      formData.allergies ? `ALLERGIES: ${formData.allergies}` : null,
      formData.meds ? `Meds: ${formData.meds}` : null,
      selectedConditions.length ? `Conditions: ${selectedConditions.join(", ")}` : null,
      formData.notes ? `Notes: ${formData.notes}` : null,
      "--- CONTACTS ---",
      formData.c1name ? `${formData.c1name}: ${formData.c1phone}` : null,
      formData.c2name ? `${formData.c2name}: ${formData.c2phone}` : null,
      formData.docname ? `Dr.${formData.docname}: ${formData.docphone}` : null,
    ].filter(Boolean);
    return lines.join("\n");
  };

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "MedAlert_QR.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  if (isEmergencyView) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-gradient-to-br from-red-800 to-red-600 p-6 flex items-center gap-4 text-white shadow-lg">
          <div className="text-4xl animate-pulse">🆘</div>
          <div>
            <h1 className="text-lg font-black uppercase tracking-wider">Emergency Medical Info</h1>
            <p className="text-xs text-white/80">Show to medical personnel immediately</p>
          </div>
        </div>
        <div className="p-5 max-w-md mx-auto space-y-4">
          <div className="border-b-2 border-slate-200 pb-4">
            <h2 className="text-3xl font-extrabold text-slate-900">{formData.name || "N/A"}</h2>
            <div className="flex gap-2 mt-3">
              {formData.age && <span className="bg-slate-200 px-3 py-1 rounded-full text-sm font-bold">Age: {formData.age}</span>}
              {formData.blood && <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">🩸 {formData.blood}</span>}
            </div>
          </div>
          {/* Medical Rows */}
          <InfoRow color="border-orange-600" label="ALLERGIES" value={formData.allergies} icon="⚠️" />
          <InfoRow color="border-blue-600" label="MEDICATIONS" value={formData.meds} icon="💊" />
          <InfoRow color="border-purple-600" label="CONDITIONS" value={selectedConditions.join(", ")} icon="🏥" />
          
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pt-4">📞 Emergency Contacts</h3>
          <ContactCard name={formData.c1name} phone={formData.c1phone} type="red" />
          <ContactCard name={formData.docname ? `Dr. ${formData.docname}` : ""} phone={formData.docphone} type="green" />
          
          <div className="bg-orange-100 border border-orange-200 p-3 rounded-lg text-orange-800 text-center text-xs font-bold">
            ⏱️ Golden Hour Awareness
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans p-6">
      <div className="max-w-[500px] mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="text-5xl mb-2">🛡️</div>
          <h1 className="text-2xl font-black text-[#ff4757]">Med-Alert</h1>
          <p className="text-slate-500 text-sm">Emergency QR — scan</p>
        </header>

        {/* Steps */}
        {!showQR && (
          <div className="flex justify-center gap-2 mb-6">
            {["Personal", "Medical", "Contacts"].map((label, i) => (
              <div
                key={label}
                className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
                  step === i ? "bg-[#ff4757] text-white border-[#ff4757]" : 
                  step > i ? "bg-[#1e1e1e] text-slate-500 border-[#333]" : "text-slate-600 border-[#222]"
                }`}
              >
                {label}
              </div>
            ))}
          </div>
        )}

        {!showQR ? (
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 shadow-xl transition-all">
            {step === 0 && (
              <section className="space-y-4">
                <h2 className="flex items-center gap-2 text-sm font-bold mb-4 uppercase tracking-wider">
                  <User size={16} /> Personal Info
                </h2>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Name *</label>
                  <input id="name" value={formData.name} onChange={handleChange} className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg p-3 outline-none focus:border-[#ff4757]" placeholder="Arjun Sharma" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Age</label>
                    <input id="age" type="number" value={formData.age} onChange={handleChange} className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg p-3 outline-none" placeholder="28" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Blood Group *</label>
                    <select id="blood" value={formData.blood} onChange={handleChange} className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg p-3 outline-none">
                      <option value="">Select</option>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={() => validateAndNext(1)} className="w-full bg-[#ff4757] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#ff6b81] transition-colors mt-4">
                  Next <ChevronRight size={18} />
                </button>
              </section>
            )}

            {step === 1 && (
              <section className="space-y-4">
                <h2 className="flex items-center gap-2 text-sm font-bold mb-4 uppercase tracking-wider">
                  <Stethoscope size={16} /> Medical Info
                </h2>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">⚠️ Allergies</label>
                  <input id="allergies" value={formData.allergies} onChange={handleChange} className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg p-3 outline-none" placeholder="Peanuts, Penicillin..." />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">💊 Medications</label>
                  <input id="meds" value={formData.meds} onChange={handleChange} className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg p-3 outline-none" placeholder="Insulin, etc." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Conditions</label>
                  <div className="flex flex-wrap gap-2">
                    {CONDS.map(c => (
                      <button
                        key={c}
                        onClick={() => toggleCondition(c)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                          selectedConditions.includes(c) ? "bg-blue-500/10 border-blue-500 text-blue-500" : "bg-transparent border-[#2a2a2a] text-slate-500"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">📝 Notes</label>
                  <textarea id="notes" value={formData.notes} onChange={handleChange} rows={2} className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg p-3 outline-none" placeholder="Any extra info..." />
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setStep(0)} className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-slate-500 font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                    <ChevronLeft size={18} /> Back
                  </button>
                  <button onClick={() => setStep(2)} className="flex-[2] bg-[#ff4757] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                    Next <ChevronRight size={18} />
                  </button>
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="space-y-6">
                <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white">
                  <Phone size={16} /> Emergency Contacts
                </h2>
                <div className="space-y-4">
                   <ContactInputGroup label="Contact 1" idName="c1name" idPhone="c1phone" data={formData} onChange={handleChange} />
                   <ContactInputGroup label="Doctor" idName="docname" idPhone="docphone" data={formData} onChange={handleChange} />
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setStep(1)} className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-slate-500 font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                    <ChevronLeft size={18} /> Back
                  </button>
                  <button onClick={() => setShowQR(true)} className="flex-[2] bg-gradient-to-r from-[#ff4757] to-[#ff6b81] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-900/20">
                    🛡️ Generate QR
                  </button>
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="bg-[#111] border border-[#222] rounded-2xl p-8 text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <h2 className="text-xl font-black text-white mb-1">✅ QR Ready!</h2>
            <p className="text-slate-500 text-sm mb-6">Scan it to view medical profile</p>
            
            <div ref={qrRef} className="inline-block p-4 bg-white rounded-xl mb-6">
              <QRCodeSVG value={buildText()} size={200} level="M" marginSize={0} />
            </div>

            <div className="flex gap-3 justify-center">
              <button onClick={downloadQR} className="bg-[#238636] hover:bg-[#2ea043] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
                <Download size={18} /> Download
              </button>
              <button onClick={() => setShowQR(false)} className="bg-transparent border border-[#2a2a2a] text-slate-400 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#1a1a1a]">
                <Edit3 size={18} /> Edit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Components
function InfoRow({ color, label, value, icon }: { color: string, label: string, value: string, icon: string }) {
  if (!value) return null;
  return (
    <div className={`bg-white p-3 rounded-lg border-l-4 ${color} shadow-sm`}>
      <div className="text-[10px] font-black text-slate-400 tracking-widest mb-1">{icon} {label}</div>
      <div className="text-slate-900 font-semibold">{value}</div>
    </div>
  );
}

function ContactCard({ name, phone, type }: { name: string, phone: string, type: 'red' | 'green' }) {
  if (!name || !phone) return null;
  const isRed = type === 'red';
  return (
    <a href={`tel:${phone}`} className={`flex justify-between items-center p-4 rounded-xl border transition-transform active:scale-95 ${isRed ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
      <div>
        <div className="text-slate-900 font-bold">{name}</div>
        <div className="text-slate-500 text-sm">{phone}</div>
      </div>
      <div className={`px-4 py-2 rounded-lg text-white text-[10px] font-black tracking-tighter ${isRed ? 'bg-red-600' : 'bg-green-600'}`}>
        {isRed ? 'CALL NOW' : 'CALL DOC'}
      </div>
    </a>
  );
}

function ContactInputGroup({ label, idName, idPhone, data, onChange }: any) {
  return (
    <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#1e1e1e]">
      <label className="text-[10px] font-black text-slate-600 uppercase mb-3 block">{label}</label>
      <div className="grid grid-cols-2 gap-3">
        <input id={idName} value={data[idName]} onChange={onChange} className="bg-[#080808] border border-[#2a2a2a] rounded-lg p-2 text-sm" placeholder="Name" />
        <input id={idPhone} value={data[idPhone]} onChange={onChange} className="bg-[#080808] border border-[#2a2a2a] rounded-lg p-2 text-sm" placeholder="Phone" />
      </div>
    </div>
  );
}