import { useState } from "react";

const courses = {
  MONTAG: { day: "MONTAG", dayEn: "MONDAY", date: 9, classes: [{ id: "pilates-mon", time: "17:15–18:15", name: "Pilates Flow", duration: "60 MIN", description: "Sanfte, kontrollierte Bewegungen für Kraft, Flexibilität und Körperbewusstsein. Perfekt für alle Levels – stärkt die Tiefenmuskulatur und verbessert die Haltung nachhaltig.", descriptionEn: "Gentle, controlled movements for strength, flexibility and body awareness. Perfect for all levels – strengthens deep muscles and improves posture." }] },
  DIENSTAG: { day: "DIENSTAG", dayEn: "TUESDAY", date: 10, classes: [] },
  MITTWOCH: { day: "MITTWOCH", dayEn: "WEDNESDAY", date: 11, classes: [{ id: "body-wed", time: "17:15–18:15", name: "Bodytoning", duration: "60 MIN", description: "Intensives Ganzkörper-Workout mit Gewichten und eigenem Körpergewicht. Definiert Muskeln, kurbelt den Stoffwechsel an und macht dich rundum leistungsfähiger.", descriptionEn: "Intensive full-body workout with weights and bodyweight. Defines muscles, boosts metabolism and makes you stronger overall." }, { id: "pilates-wed", time: "17:30–18:30", name: "Pilates Flow", duration: "60 MIN", description: "Sanfte, kontrollierte Bewegungen für Kraft, Flexibilität und Körperbewusstsein. Perfekt für alle Levels.", descriptionEn: "Gentle, controlled movements for strength, flexibility and body awareness. Perfect for all levels." }] },
  DONNERSTAG: { day: "DONNERSTAG", dayEn: "THURSDAY", date: 12, classes: [] },
  FREITAG: { day: "FREITAG", dayEn: "FRIDAY", date: 13, classes: [{ id: "weightkick-fri", time: "18:30", name: "Weightkick", duration: "60 MIN", description: "Die perfekte Kombination aus Kickboxen und Krafttraining. Baut Stress ab, stärkt Ausdauer und Koordination.", descriptionEn: "The perfect blend of kickboxing and strength training. Relieves stress and builds endurance and coordination." }] },
  SAMSTAG: { day: "SAMSTAG", dayEn: "SATURDAY", date: 14, classes: [{ id: "morning-sat", time: "10:15–11:15", name: "Morning Glow", duration: "60 MIN", description: "Sanftes Yoga, Mobility und Atemübungen für einen energiereichen Start in den Tag.", descriptionEn: "Gentle yoga, mobility and breathing exercises for an energised start to your day." }] },
};

const week = ["MONTAG", "DIENSTAG", "MITTWOCH", "DONNERSTAG", "FREITAG", "SAMSTAG"];

const t = {
  de: {
    subtitle: "Wähle deinen Kurs für diese Woche",
    noClass: "KEIN KURS",
    cancel: "Abbrechen",
    cta: "Kostenlos testen →",
    freeTitle: "Erste Stunde gratis ✦",
    freeDesc: "Dein erster Kurs ist vollständig kostenlos – keine Kreditkarte, kein Risiko.",
    aboTitle: "Danach flexibel weitermachen",
    aboDesc: "Monatlich kündbar · Jahresabo mit Ersparnis · Unlimitierte Kurse.",
    march: "MÄRZ",
    formTitle: "Jetzt anmelden",
    namePh: "Dein Name *",
    emailPh: "Deine Email *",
    telPh: "Telefon (optional)",
    notizPh: "Notiz / Fragen (optional)",
    submit: "Gratis Platz sichern →",
    submitting: "Wird gesendet...",
    successTitle: "Anmeldung erfolgreich!",
    successMsg: (name, course, date, time) => `Hallo ${name}! Dein Platz für ${course} am ${date}. März um ${time} ist reserviert. Deine erste Stunde ist gratis!`,
    another: "Weiteren Kurs wählen",
    required: "Name und Email sind Pflichtfelder.",
    errorMsg: "Fehler beim Speichern. Bitte erneut versuchen.",
  },
  en: {
    subtitle: "Choose your course for this week",
    noClass: "NO CLASS",
    cancel: "Cancel",
    cta: "Try for free →",
    freeTitle: "First class free ✦",
    freeDesc: "Your first class is completely free – no credit card, no risk.",
    aboTitle: "Stay flexible afterwards",
    aboDesc: "Cancel monthly / month · Annual plan with savings · Unlimited classes.",
    march: "MARCH",
    formTitle: "Sign up now",
    namePh: "Your name *",
    emailPh: "Your email *",
    telPh: "Phone (optional)",
    notizPh: "Notes / Questions (optional)",
    submit: "Reserve free spot →",
    submitting: "Sending...",
    successTitle: "Registration successful!",
    successMsg: (name, course, date, time) => `Hello ${name}! Your spot for ${course} on ${date} March at ${time} is reserved. First class is free!`,
    another: "Choose another class",
    required: "Name and email are required.",
    errorMsg: "Error saving. Please try again.",
  },
};

export default function App() {
  const [lang, setLang] = useState("de");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", telefon: "", notiz: "" });
  const [status, setStatus] = useState("idle");
  const [formError, setFormError] = useState("");
  const tx = t[lang];

  const handleSelect = (cls, dayData) => {
    if (selected?.id === cls.id) { setSelected(null); setShowForm(false); return; }
    setSelected({ ...cls, day: lang === "de" ? dayData.day : dayData.dayEn, date: dayData.date });
    setShowForm(false);
    setStatus("idle");
    setForm({ name: "", email: "", telefon: "", notiz: "" });
    setFormError("");
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) { setFormError(tx.required); return; }
    setStatus("submitting");
    setFormError("");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          telefon: form.telefon,
          notiz: form.notiz,
          trialclass: `${selected.name} – ${selected.date}. ${tx.march} ${selected.time}`,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch (e) {
      setStatus("error");
    }
  };

  const inp = (field, placeholder) => (
    <input
      value={form[field]}
      onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
      placeholder={placeholder}
      style={{ width: "100%", background: "#f5f0ea", border: "1px solid #d9d1c5", padding: "12px 16px", fontFamily: "'Jost',sans-serif", fontSize: 14, fontWeight: 300, color: "#2a2035", outline: "none", marginBottom: 10 }}
    />
  );

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: "#f5f0ea", minHeight: "100vh", paddingBottom: 60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .card{background:#ede8e0;border:1px solid #d9d1c5;transition:all 0.22s ease;cursor:pointer;}
        .card:hover{background:#e3dbd0;}
        .card.active{background:#3b2f4a;border-color:#3b2f4a;}
        .btn-p{background:#3b2f4a;color:#f5f0ea;border:none;padding:13px 32px;font-family:'Jost',sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:background 0.2s;}
        .btn-p:hover{background:#2a2035;}
        .btn-p:disabled{background:#9a8e84;cursor:not-allowed;}
        .btn-s{background:transparent;color:#3b2f4a;border:1px solid #3b2f4a;padding:12px 32px;font-family:'Jost',sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all 0.2s;}
        .btn-s:hover{background:#3b2f4a;color:#f5f0ea;}
        .lang-btn{background:none;border:none;font-family:'Jost',sans-serif;font-size:11px;letter-spacing:2.5px;cursor:pointer;padding:6px 10px;transition:all 0.2s;text-transform:uppercase;}
        .lang-btn.al{color:#3b2f4a;border-bottom:1.5px solid #3b2f4a;}
        .lang-btn.il{color:#b0a498;border-bottom:1.5px solid transparent;}
        .lang-btn.il:hover{color:#7a6e63;}
        .fade{animation:fi 0.35s ease forwards;}
        @keyframes fi{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        input::placeholder,textarea::placeholder{color:#b0a498;}
        @media(max-width:700px){.grid{grid-template-columns:1fr!important;}.two-col{grid-template-columns:1fr!important;}}
      `}</style>

      <div style={{ padding: "40px 32px 16px", maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 44, fontWeight: 300, color: "#2a2035", lineHeight: 1.1 }}>Age at your <em style={{ color: "#6b4fa0" }}>own terms</em></div>
            <div style={{ fontFamily: "'Jost',sans-serif", fontSize: 14, fontWeight: 300, color: "#7a6e63", marginTop: 10 }}>{tx.subtitle}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 2, marginTop: 6 }}>
            <button className={`lang-btn ${lang === "de" ? "al" : "il"}`} onClick={() => setLang("de")}>DE</button>
            <span style={{ color: "#d9d1c5", fontFamily: "'Jost',sans-serif", fontSize: 11 }}>|</span>
            <button className={`lang-btn ${lang === "en" ? "al" : "il"}`} onClick={() => setLang("en")}>EN</button>
          </div>
        </div>
      </div>

      <div style={{ background: "#ede8e0", borderTop: "1px solid #d9d1c5", borderBottom: "1px solid #d9d1c5", display: "flex", alignItems: "center", marginTop: 20 }}>
        <button style={{ background: "none", border: "none", padding: "18px 28px", cursor: "pointer", fontSize: 17, color: "#9a8e84" }}>←</button>
        <div style={{ flex: 1, textAlign: "center", fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: 4, color: "#7a6e63" }}>9. {tx.march} — 14. {tx.march}</div>
        <button style={{ background: "none", border: "none", padding: "18px 28px", cursor: "pointer", fontSize: 17, color: "#9a8e84" }}>→</button>
      </div>

      <div className="grid" style={{ maxWidth: 1080, margin: "28px auto 0", padding: "0 20px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {week.map((dayKey) => {
          const d = courses[dayKey];
          const dayLabel = lang === "de" ? d.day : d.dayEn;
          return (
            <div key={dayKey}>
              <div style={{ background: "#e8e1d7", border: "1px solid #d9d1c5", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, letterSpacing: 3, color: "#7a6e63" }}>{dayLabel}</span>
                <span style={{ fontSize: 38, fontWeight: 300, color: "#2a2035", lineHeight: 1 }}>{d.date}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {d.classes.length === 0 ? (
                  <div className="card" style={{ padding: "38px 18px", textAlign: "center", cursor: "default", minHeight: 110, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, letterSpacing: 3, color: "#b0a498" }}>{tx.noClass}</span>
                  </div>
                ) : d.classes.map((cls) => {
                  const isActive = selected?.id === cls.id;
                  return (
                    <div key={cls.id} className={`card${isActive ? " active" : ""}`} onClick={() => handleSelect(cls, d)} style={{ padding: "16px 18px", minHeight: 95 }}>
                      <div style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, letterSpacing: 1.5, color: isActive ? "#c5b8d4" : "#9a8e84", marginBottom: 5 }}>{cls.time}</div>
                      <div style={{ fontSize: 21, fontWeight: 400, color: isActive ? "#f5f0ea" : "#2a2035", marginBottom: 5 }}>{cls.name}</div>
                      <div style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, letterSpacing: 2, color: isActive ? "#c5b8d4" : "#9a8e84" }}>{cls.duration}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="fade" style={{ maxWidth: 1080, margin: "26px auto 0", padding: "0 20px" }}>
          <div style={{ background: "#ede8e0", border: "1px solid #d9d1c5", padding: "34px 38px" }}>
            {status === "success" ? (
              <div className="fade" style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: 46, color: "#6b4fa0", marginBottom: 10 }}>✦</div>
                <div style={{ fontSize: 30, fontWeight: 400, color: "#2a2035", marginBottom: 8 }}>{tx.successTitle}</div>
                <div style={{ fontFamily: "'Jost',sans-serif", fontSize: 14, fontWeight: 300, color: "#7a6e63", lineHeight: 1.8, marginBottom: 28 }}>
                  {tx.successMsg(form.name, selected.name, selected.date, selected.time)}
                </div>
                <button className="btn-s" onClick={() => { setSelected(null); setShowForm(false); setStatus("idle"); }}>{tx.another}</button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 18, marginBottom: 20 }}>
                  <div>
                    <div style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, letterSpacing: 3, color: "#9a8e84", marginBottom: 7 }}>{selected.day} · {selected.date}. {tx.march} · {selected.time}</div>
                    <div style={{ fontSize: 32, fontWeight: 400, color: "#2a2035" }}>{selected.name}</div>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    <button className="btn-s" onClick={() => { setSelected(null); setShowForm(false); }}>{tx.cancel}</button>
                    {!showForm && <button className="btn-p" onClick={() => setShowForm(true)}>{tx.cta}</button>}
                  </div>
                </div>

                <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                  <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 14, fontWeight: 300, color: "#5a4e44", lineHeight: 1.85 }}>{selected.description}</p>
                  <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 13, fontWeight: 300, color: "#9a8e84", lineHeight: 1.85, fontStyle: "italic", borderLeft: "1px solid #d9d1c5", paddingLeft: 24 }}>{selected.descriptionEn}</p>
                </div>

                {showForm && (
                  <div className="fade" style={{ borderTop: "1px solid #d9d1c5", paddingTop: 28, marginBottom: 24 }}>
                    <div style={{ fontSize: 22, fontWeight: 400, color: "#2a2035", marginBottom: 20 }}>{tx.formTitle}</div>
                    <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                      {inp("name", tx.namePh)}
                      {inp("email", tx.emailPh)}
                      {inp("telefon", tx.telPh)}
                    </div>
                    <textarea
                      value={form.notiz}
                      onChange={e => setForm(f => ({ ...f, notiz: e.target.value }))}
                      placeholder={tx.notizPh}
                      rows={3}
                      style={{ width: "100%", background: "#f5f0ea", border: "1px solid #d9d1c5", padding: "12px 16px", fontFamily: "'Jost',sans-serif", fontSize: 14, fontWeight: 300, color: "#2a2035", outline: "none", resize: "vertical", marginBottom: 10 }}
                    />
                    {formError && <div style={{ fontFamily: "'Jost',sans-serif", fontSize: 12, color: "#c0392b", marginBottom: 10 }}>{formError}</div>}
                    {status === "error" && <div style={{ fontFamily: "'Jost',sans-serif", fontSize: 12, color: "#c0392b", marginBottom: 10 }}>{tx.errorMsg}</div>}
                    <button className="btn-p" onClick={handleSubmit} disabled={status === "submitting"}>
                      {status === "submitting" ? tx.submitting : tx.submit}
                    </button>
                  </div>
                )}

                <div className="two-col" style={{ borderTop: "1px solid #d9d1c5", paddingTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 600, color: "#6b4fa0", marginBottom: 6 }}>{tx.freeTitle}</div>
                    <div style={{ fontFamily: "'Jost',sans-serif", fontSize: 13, fontWeight: 300, color: "#7a6e63", lineHeight: 1.75 }}>{tx.freeDesc}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 600, color: "#2a2035", marginBottom: 6 }}>{tx.aboTitle}</div>
                    <div style={{ fontFamily: "'Jost',sans-serif", fontSize: 13, fontWeight: 300, color: "#7a6e63", lineHeight: 1.75 }}>{tx.aboDesc}</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
