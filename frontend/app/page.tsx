'use client';
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const personalities = [
  { type: "The Night Owl", emoji: "🦉", color: "#8B5CF6", desc: "Sleeps at 3AM, vibes at midnight" },
  { type: "The Clean Freak", emoji: "✨", color: "#EC4899", desc: "Dishes washed before you blink" },
  { type: "The Social Butterfly", emoji: "🦋", color: "#F59E0B", desc: "Always has people over" },
  { type: "The Hermit", emoji: "🐢", color: "#10B981", desc: "Netflix and no talking please" },
  { type: "The Study Machine", emoji: "📚", color: "#3B82F6", desc: "Library at 2AM is home" },
  { type: "The Chaos Goblin", emoji: "🌀", color: "#EF4444", desc: "Organized chaos is still organized" },
];

const flats = [
  { id: 1, price: "₹7,500", location: "Koregaon Park, Pune", type: "2BHK", match: 94, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop", badge: "🔥 Hot", badgeColor: "#EF4444", name: "Priya S.", dept: "CSE · 3rd yr", tags: ["🦉 Night Owl", "✨ Clean", "📚 Study"], color: "#EC4899" },
  { id: 2, price: "₹5,500", location: "Baner, Pune · 2 seats left", type: "3BHK", match: 87, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop", badge: "✨ New", badgeColor: "#10B981", name: "Arjun M.", dept: "IT · 4th yr", tags: ["🦋 Social", "🎮 Gamer", "🌙 Late nights"], color: "#3B82F6" },
  { id: 3, price: "₹9,000", location: "Viman Nagar, Pune · Premium", type: "2BHK", match: 78, image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop", badge: "✅ Verified", badgeColor: "#8B5CF6", name: "Sneha K.", dept: "Design · 2nd yr", tags: ["🐢 Introvert", "📖 Reader", "🎨 Creative"], color: "#F59E0B" },
];
const quiz = [
  { q: "When do you sleep? 😴", opts: ["Before 11PM 🌙", "11PM–1AM ⭐", "1AM–3AM 🦉", "Sleep is a myth 💀"] },
  { q: "Your room vibe? 🏠", opts: ["Pinterest perfect ✨", "Organized chaos 🌀", "Floor is storage 😅", "What is a room? 🤔"] },
  { q: "Friends over? 🎉", opts: ["Every weekend! 🦋", "Occasionally 😊", "Rare occasions 🙂", "Never, ever 🐢"] },
  { q: "Study style? 📚", opts: ["Dead silence only 🤫", "Lo-fi music 🎵", "Chaos around me 🌀", "Coffee shop gang ☕"] },
];

export default function Home() {
  const [activeP, setActiveP] = useState(0);
  const [tab, setTab] = useState('explore');
  const [selectedFlat, setSelectedFlat] = useState<any>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'them', text: "Hey! I saw your profile — we seem super compatible! 👀" },
    { from: 'me', text: "Omg yes! 94% match is insane 😭 Are you also in Pune?" },
    { from: 'them', text: "Yes! Koregaon Park. You should come see the flat! 🏠" },
  ]);
  const [input, setInput] = useState('');
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [redFlag, setRedFlag] = useState(false);
  const [activeChip, setActiveChip] = useState('All');
  const [showAuth, setShowAuth] = useState(false);
const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
const [editProfile, setEditProfile] = useState(false);
const [profileName, setProfileName] = useState('Niyati M.');
const [profileCollege, setProfileCollege] = useState('CSE · 3rd Year · Pune');
const [profileBudget, setProfileBudget] = useState('₹6k–9k/mo');
const [profileBio, setProfileBio] = useState('');
const [profilePhoto, setProfilePhoto] = useState('');
const [userRole, setUserRole] = useState<'seeker' | 'host' | null>(null);
const [onboardingComplete, setOnboardingComplete] = useState(false);
const [profileSetupStep, setProfileSetupStep] = useState(0);
const [myListing, setMyListing] = useState<any>(null);
const [listingPrice, setListingPrice] = useState('');
const [listingLocation, setListingLocation] = useState('');
const [listingType, setListingType] = useState('2BHK');
const [listingImages, setListingImages] = useState<string[]>([]);
const [profileSleep, setProfileSleep] = useState('After 1AM');
const [profileStudy, setProfileStudy] = useState('Dead Silence');
const [profileVibe, setProfileVibe] = useState('Clean Freak');
const [profileSocial, setProfileSocial] = useState('Selective');
const [profileDiet, setProfileDiet] = useState('Vegetarian');
const [searchQuery, setSearchQuery] = useState('');
const [savedFlats, setSavedFlats] = useState<number[]>([]);

const [uploadingImage, setUploadingImage] = useState(false);
const [uploadedImages, setUploadedImages] = useState<{[key: number]: string[]}>({});
const [activeImageIndex, setActiveImageIndex] = useState(0);
const [voiceModal, setVoiceModal] = useState(false);
const [recording, setRecording] = useState(false);
const [voiceResult, setVoiceResult] = useState<any>(null);
const [voiceTranscript, setVoiceTranscript] = useState('');
const [authLoading, setAuthLoading] = useState(false);
const [authError, setAuthError] = useState('');
const [authName, setAuthName] = useState('');
const [authEmail, setAuthEmail] = useState('');
const [authPassword, setAuthPassword] = useState('');
const [authMode2, setAuthMode2] = useState<'login' | 'signup' | 'forgot' | 'reset'>('login');
const [resetOtp, setResetOtp] = useState('');
const [newPassword, setNewPassword] = useState('');
const [currentUser, setCurrentUser] = useState<any>(null);
  useEffect(() => {
    const interval = setInterval(() => setActiveP(p => (p + 1) % personalities.length), 2000);
    return () => clearInterval(interval);
  }, []);

  const handleQuiz = (opt: string) => {
    if (quizStep < quiz.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      setQuizResult(personalities[Math.floor(Math.random() * personalities.length)]);
    }
  };
  useEffect(() => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) setCurrentUser(JSON.parse(savedUser));
}, []);
const socketRef = useRef<any>(null);

useEffect(() => {
  socketRef.current = io('https://roomateai.onrender.com');
  return () => {
    socketRef.current?.disconnect();
  };
}, []);

useEffect(() => {
  if (!socketRef.current) return;
  socketRef.current.on('receive_message', (data: any) => {
    setMessages(prev => [...prev, { from: 'them', text: data.text }]);
  });
  return () => {
    socketRef.current?.off('receive_message');
  };
}, []);
 const sendMsg = async () => {
  if (!input.trim()) return;
  const userMsg = input;
  setMessages(prev => [...prev, { from: 'me', text: userMsg }]);
  setInput('');
  setMessages(prev => [...prev, { from: 'them', text: '⏳ typing...' }]);
  
  try {
    const res = await fetch('https://roomateai.onrender.com/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMsg, name: selectedFlat?.name || 'Priya' })
    });
    const data = await res.json();
    setMessages(prev => [...prev.slice(0, -1), { from: 'them', text: data.reply }]);
  } catch {
    const replies = ["That sounds amazing! 🌙", "Yes exactly!! 😭", "We should meet up!", "Same energy fr fr 💜"];
    setMessages(prev => [...prev.slice(0, -1), { from: 'them', text: replies[Math.floor(Math.random() * replies.length)] }]);
  }
};

  const chips = ['All', 'Under ₹8k', 'Near College', 'Girls Only', 'Co-ed', 'AC Room'];

  if (selectedFlat && !chatOpen) return (
    <div style={{ background: '#09090b', minHeight: '100vh', color: 'white', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #27272a', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => setSelectedFlat(null)} style={{ background: 'none', border: 'none', color: '#EC4899', cursor: 'pointer', fontSize: '16px', fontWeight: 700 }}>← Back</button>
        <span style={{ fontWeight: 700 }}>Flat Details</span>
      </div>
      <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ background: `linear-gradient(135deg, ${selectedFlat.color}20, #1a1a2e)`, border: `1px solid ${selectedFlat.color}40`, borderRadius: '20px', padding: '24px', marginBottom: '16px', textAlign: 'center' }}>
<img 
  src={uploadedImages[selectedFlat.id]?.[activeImageIndex] || selectedFlat.image} 
  alt={selectedFlat.location} 
  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px' }} 
/>
{uploadedImages[selectedFlat.id]?.length > 0 && (
  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', overflowX: 'auto' }}>
    {[selectedFlat.image, ...uploadedImages[selectedFlat.id]].map((url, i) => (
      <img 
        key={i} 
        src={url} 
        onClick={(e) => { e.stopPropagation(); setActiveImageIndex(i === 0 ? 0 : i - 1); }}
        style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0, cursor: 'pointer', border: activeImageIndex === (i === 0 ? 0 : i - 1) ? '2px solid #EC4899' : '2px solid transparent' }} 
      />
    ))}
  </div>
)}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '26px', fontWeight: 900, background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{selectedFlat.price}/mo</div>
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>📍 {selectedFlat.location}</div>
            </div>
            <div style={{ background: '#10B98120', border: '1px solid #10B98140', borderRadius: '12px', padding: '10px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#10B981' }}>{selectedFlat.match}%</div>
              <div style={{ fontSize: '10px', color: '#6b7280' }}>AI Match</div>
            </div>
          </div>
        </div>
        <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '16px', marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', color: '#6b7280', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 700 }}>FLAT DETAILS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[['Type', selectedFlat.type], ['Available', 'July 1, 2026'], ['Seats Left', '1 seat'], ['Deposit', '₹15,000']].map(([l, v]) => (
              <div key={l} style={{ background: '#27272a', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>{l}</div>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '16px', marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', color: '#6b7280', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 700 }}>AMENITIES</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['🛜 WiFi', '❄️ AC', '🛵 Parking', '🧺 Washing Machine', '🍳 Kitchen', '🔒 Security'].map(a => (
              <span key={a} style={{ background: '#27272a', padding: '6px 12px', borderRadius: '20px', fontSize: '12px' }}>{a}</span>
            ))}
          </div>
        </div>
        <div style={{ background: '#10B98115', border: '1px solid #10B98130', borderRadius: '16px', padding: '14px', marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', color: '#10B981', letterSpacing: '2px', fontWeight: 700, marginBottom: '8px' }}>🧠 WHY YOU MATCH</div>
          <div style={{ fontSize: '13px', color: '#d1fae5', lineHeight: 1.7 }}>Both sleep late, prefer silent study sessions, and are vegetarian. AI predicts {selectedFlat.match}% harmony! ✨</div>
        </div>
{selectedFlat.id === 999 && (
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', marginBottom: '12px', cursor: 'pointer', color: '#EC4899', fontSize: '12px', fontWeight: 600 }}>
          {uploadingImage ? '⏳ Uploading...' : '📷 Add photos of this flat'}
          <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={async (e) => {
            if (!e.target.files?.length) return;
            setUploadingImage(true);
            const newUrls: string[] = [];
            for (const file of Array.from(e.target.files)) {
              const formData = new FormData();
              formData.append('image', file);
              try {
                const res = await fetch('https://roomateai.onrender.com/api/upload', {
                  method: 'POST',
                  body: formData
                });
                const data = await res.json();
                newUrls.push(data.url);
              } catch {
                alert('❌ Upload failed for one image!');
              }
            }
            setUploadedImages(prev => ({ ...prev, [selectedFlat.id]: [...(prev[selectedFlat.id] || []), ...newUrls] }));
            setUploadingImage(false);
          }} />
        </label>
        )}


        <button onClick={() => setChatOpen(true)} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', border: 'none', borderRadius: '14px', color: 'white', fontSize: '16px', fontWeight: 800, cursor: 'pointer', marginBottom: '10px' }}>
          💬 Start Chat with {selectedFlat.name}
        </button>
        <button onClick={() => setSelectedFlat(null)} style={{ width: '100%', padding: '14px', background: '#18181b', border: '1px solid #27272a', borderRadius: '14px', color: '#9ca3af', fontSize: '14px', cursor: 'pointer' }}>
          ← Back to Explore
        </button>
      </div>
    </div>
  );

  if (chatOpen) return (
    <div style={{ background: '#09090b', height: '100vh', color: 'white', fontFamily: 'Segoe UI, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 16px', background: '#18181b', borderBottom: '1px solid #27272a', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', color: '#EC4899', cursor: 'pointer', fontSize: '20px' }}>←</button>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>👩</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '14px' }}>{selectedFlat?.name || 'Priya S.'}</div>
          <div style={{ fontSize: '11px', color: '#10B981' }}>● Online · {selectedFlat?.match || 94}% match</div>
        </div>
        <button onClick={() => setRedFlag(!redFlag)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>⚠️</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {redFlag && (
          <div style={{ background: '#EF444420', border: '1px solid #EF444440', borderRadius: '12px', padding: '10px 14px', fontSize: '12px', color: '#FCA5A5' }}>
            ⚠️ AI detected unusual behavior. Be cautious sharing personal info.
          </div>
        )}
        <div onClick={() => setMessages(prev => [...prev, { from: 'me', text: "Hey! We're both night owls — do you also study till 3AM? 😄" }])}
          style={{ background: 'linear-gradient(135deg, #8B5CF620, #EC489920)', border: '1px solid #8B5CF640', borderRadius: '12px', padding: '10px 14px', fontSize: '12px', color: '#c4b5fd', cursor: 'pointer' }}>
          💜 AI Icebreaker: "Hey! We're both night owls — do you also study till 3AM? 😄" <span style={{ color: '#6b7280' }}>Tap to send</span>
        </div>
        {messages.map((m, i) => (
          <div key={i} style={{ maxWidth: '75%', padding: '10px 14px', borderRadius: '18px', fontSize: '13px', lineHeight: 1.5, alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start', background: m.from === 'me' ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' : '#27272a', borderBottomRightRadius: m.from === 'me' ? '4px' : '18px', borderBottomLeftRadius: m.from === 'them' ? '4px' : '18px' }}>
            {m.text}
          </div>
        ))}
      </div>
      <div style={{ padding: '12px 16px', background: '#18181b', borderTop: '1px solid #27272a', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()} placeholder="Type a message..." style={{ flex: 1, padding: '10px 16px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '24px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }} />
        <button onClick={sendMsg} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer' }}>➤</button>
      </div>
    </div>
  );

 if (!currentUser && authMode2 === 'forgot') return (
    <div style={{ background: '#09090b', minHeight: '100vh', color: 'white', fontFamily: 'Segoe UI, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '380px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔑</div>
        <h1 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '8px' }}>Forgot Password?</h1>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>Enter your email, we'll send you an OTP</p>

        <input value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="Email" type="email" style={{ width: '100%', padding: '14px 16px', background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: '12px' }} />
        {authError && <p style={{ color: '#EF4444', fontSize: '12px', marginBottom: '12px' }}>{authError}</p>}

        <button onClick={async () => {
          setAuthError('');
          if (!authEmail) return setAuthError('Email is required!');
          setAuthLoading(true);
          try {
            const res = await fetch('https://roomateai.onrender.com/api/auth/forgot-password', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: authEmail })
            });
            const data = await res.json();
            if (data.error) setAuthError(data.error);
            else setAuthMode2('reset');
          } catch {
            setAuthError('Something went wrong!');
          } finally {
            setAuthLoading(false);
          }
        }} style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', border: 'none', borderRadius: '14px', color: 'white', fontSize: '15px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', opacity: authLoading ? 0.7 : 1, marginBottom: '12px' }}>
          {authLoading ? '⏳ Sending...' : 'Send OTP →'}
        </button>

        <p onClick={() => { setAuthMode2('login'); setAuthError(''); }} style={{ fontSize: '13px', color: '#6b7280', cursor: 'pointer' }}>← Back to Login</p>
      </div>
    </div>
  );
if (!currentUser && authMode2 === 'reset') return (
    <div style={{ background: '#09090b', minHeight: '100vh', color: 'white', fontFamily: 'Segoe UI, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '380px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>📧</div>
        <h1 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '8px' }}>Enter OTP</h1>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>Check your email for the 6-digit code</p>

        <input value={resetOtp} onChange={e => setResetOtp(e.target.value)} placeholder="6-digit OTP" maxLength={6} style={{ width: '100%', padding: '14px 16px', background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: 'white', fontSize: '20px', textAlign: 'center', letterSpacing: '8px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: '12px' }} />
        <input value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" type="password" style={{ width: '100%', padding: '14px 16px', background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: '12px' }} />
        {authError && <p style={{ color: '#EF4444', fontSize: '12px', marginBottom: '12px' }}>{authError}</p>}

        <button onClick={async () => {
          setAuthError('');
          if (!resetOtp || !newPassword) return setAuthError('Please fill all fields!');
          setAuthLoading(true);
          try {
const res = await fetch('https://roomateai.onrender.com/api/auth/reset-password', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: authEmail, otp: resetOtp, newPassword })
            });
            const data = await res.json();
            if (data.error) setAuthError(data.error);
            else {
              alert('✅ Password reset successful! Please login.');
              setAuthMode2('login');
              setAuthMode('login');
              setResetOtp('');
              setNewPassword('');
            }
          } catch {
            setAuthError('Something went wrong!');
          } finally {
            setAuthLoading(false);
          }
        }} style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', border: 'none', borderRadius: '14px', color: 'white', fontSize: '15px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', opacity: authLoading ? 0.7 : 1, marginBottom: '12px' }}>
          {authLoading ? '⏳ Resetting...' : 'Reset Password →'}
        </button>

        <p onClick={() => { setAuthMode2('login'); setAuthError(''); }} style={{ fontSize: '13px', color: '#6b7280', cursor: 'pointer' }}>← Back to Login</p>
      </div>
    </div>
  );
if (!currentUser) return (
    <div style={{ background: '#09090b', minHeight: '100vh', color: 'white', fontFamily: 'Segoe UI, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '380px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
        <h1 style={{ fontSize: '28px', fontWeight: 900, background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>RoommateAI</h1>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '32px' }}>Find your perfect roommate with AI</p>

        <div style={{ display: 'flex', background: '#27272a', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
          {(['login', 'signup'] as const).map(mode => (
            <button key={mode} onClick={() => setAuthMode(mode)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700, background: authMode === mode ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' : 'transparent', color: authMode === mode ? 'white' : '#6b7280', fontFamily: 'inherit' }}>
              {mode === 'login' ? 'Login' : 'Sign Up'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {authMode === 'signup' && (
            <input value={authName} onChange={e => setAuthName(e.target.value)} placeholder="Full Name" style={{ padding: '14px 16px', background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          )}
          <input value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="Email" type="email" style={{ padding: '14px 16px', background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          <input value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder="Password" type="password" style={{ padding: '14px 16px', background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
         {authMode === 'login' && (
            <p onClick={() => setAuthMode2('forgot')} style={{ fontSize: '12px', color: '#8B5CF6', cursor: 'pointer', textAlign: 'right', margin: '-8px 0 0' }}>Forgot Password?</p>
          )}
          {authError && <p style={{ color: '#EF4444', fontSize: '12px', margin: 0 }}>{authError}</p>}
        </div> 

        <button onClick={async () => {
          setAuthError('');
          if (!authEmail || !authPassword) return setAuthError('Email and password are required!');
          if (authMode === 'signup' && !authName) return setAuthError('Name is required!');
          setAuthLoading(true);
          try {
const res = await fetch(`https://roomateai.onrender.com/api/auth/${authMode}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: authName, email: authEmail, password: authPassword })
            });
            const data = await res.json();
            if (data.error) {
              setAuthError(data.error);
            } else {
              localStorage.setItem('token', data.token);
              localStorage.setItem('user', JSON.stringify(data.user));
              setCurrentUser(data.user);
            }
          } catch {
            setAuthError('Something went wrong!');
          } finally {
            setAuthLoading(false);
          }
        }} style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', border: 'none', borderRadius: '14px', color: 'white', fontSize: '15px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', opacity: authLoading ? 0.7 : 1 }}>
          {authLoading ? '⏳ Please wait...' : authMode === 'login' ? 'Login →' : 'Create Account →'}
        </button>
      </div>
    </div>
  );
  if (currentUser && !userRole) return (
    <div style={{ background: '#09090b', minHeight: '100vh', color: 'white', fontFamily: 'Segoe UI, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '380px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>👋</div>
        <h1 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '8px' }}>Hey {currentUser.name?.split(' ')[0]}!</h1>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '32px' }}>What brings you here?</p>

        <div onClick={() => setUserRole('seeker')} style={{ background: '#18181b', border: '2px solid #27272a', borderRadius: '18px', padding: '24px', marginBottom: '14px', cursor: 'pointer', textAlign: 'left' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
          <div style={{ fontSize: '17px', fontWeight: 800, marginBottom: '4px' }}>I'm looking for a room</div>
          <div style={{ fontSize: '13px', color: '#9ca3af' }}>Browse flats and find your perfect roommate</div>
        </div>

        <div onClick={() => setUserRole('host')} style={{ background: '#18181b', border: '2px solid #27272a', borderRadius: '18px', padding: '24px', cursor: 'pointer', textAlign: 'left' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏠</div>
          <div style={{ fontSize: '17px', fontWeight: 800, marginBottom: '4px' }}>I have a room/flat</div>
          <div style={{ fontSize: '13px', color: '#9ca3af' }}>List your space and find a roommate</div>
        </div>
      </div>
    </div>
  );
  if (currentUser && userRole && !onboardingComplete && !quizResult) return (
    <div style={{ background: '#09090b', minHeight: '100vh', color: 'white', fontFamily: 'Segoe UI, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎭</div>
          <h1 style={{ fontSize: '20px', fontWeight: 900 }}>Quick Vibe Check</h1>
          <p style={{ fontSize: '13px', color: '#6b7280' }}>Help us find your perfect match</p>
        </div>

        <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '20px' }}>
          <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px' }}>{quizStep + 1}/{quiz.length}</div>
          <div style={{ height: '3px', background: '#27272a', borderRadius: '2px', marginBottom: '20px' }}>
            <div style={{ height: '100%', width: `${(quizStep / quiz.length) * 100}%`, background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', borderRadius: '2px' }} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>{quiz[quizStep].q}</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {quiz[quizStep].opts.map(opt => (
              <button key={opt} onClick={() => handleQuiz(opt)} style={{ padding: '14px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '12px', color: 'white', cursor: 'pointer', textAlign: 'left', fontSize: '14px', fontFamily: 'inherit' }}>{opt}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

if (currentUser && userRole && !onboardingComplete && quizResult) return (
    <div style={{ background: '#09090b', minHeight: '100vh', color: 'white', fontFamily: 'Segoe UI, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '380px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>{quizResult.emoji}</div>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: quizResult.color, marginBottom: '8px' }}>{quizResult.type}</h1>
        <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '32px' }}>{quizResult.desc}</p>
   <button onClick={() => setOnboardingComplete(true)} style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', border: 'none', borderRadius: '14px', color: 'white', fontSize: '15px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
          Set Up My Profile →
        </button>
      </div>
    </div>
  );

if (currentUser && userRole && quizResult && onboardingComplete && profileSetupStep < 6) return (
    <div style={{ background: '#09090b', minHeight: '100vh', color: 'white', fontFamily: 'Segoe UI, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ height: '4px', background: '#27272a', borderRadius: '2px', marginBottom: '32px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${((profileSetupStep + 1) / 6) * 100}%`, background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', borderRadius: '2px', transition: 'width 0.4s ease' }} />
        </div>

        {profileSetupStep === 0 && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>👤</div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '6px' }}>What's your name?</h2>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>Let your future roommate know you</p>
            <input value={profileName} onChange={e => setProfileName(e.target.value)} placeholder="Your full name" style={{ width: '100%', padding: '16px', background: '#18181b', border: '1px solid #27272a', borderRadius: '14px', color: 'white', fontSize: '16px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: '20px' }} />
          </div>
        )}

        {profileSetupStep === 1 && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎓</div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '6px' }}>Where do you study?</h2>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>College & year</p>
            <input value={profileCollege} onChange={e => setProfileCollege(e.target.value)} placeholder="e.g. CSE · 3rd Year · Pune" style={{ width: '100%', padding: '16px', background: '#18181b', border: '1px solid #27272a', borderRadius: '14px', color: 'white', fontSize: '16px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: '20px' }} />
          </div>
        )}
{profileSetupStep === 2 && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌙</div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '6px' }}>When do you sleep?</h2>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>Be honest, no judgment here</p>
            <div style={{ display: 'grid', gap: '10px', marginBottom: '12px' }}>
              {['Before 11PM', '11PM–1AM', 'After 1AM', 'Sleep is a myth'].map(opt => (
                <button key={opt} onClick={() => setProfileSleep(opt)} style={{ padding: '16px', background: profileSleep === opt ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' : '#18181b', border: profileSleep === opt ? 'none' : '1px solid #27272a', borderRadius: '14px', color: 'white', cursor: 'pointer', textAlign: 'left', fontSize: '14px', fontFamily: 'inherit', fontWeight: profileSleep === opt ? 700 : 400 }}>{opt}</button>
              ))}
            </div>
            <input value={['Before 11PM', '11PM–1AM', 'After 1AM', 'Sleep is a myth'].includes(profileSleep) ? '' : profileSleep} onChange={e => setProfileSleep(e.target.value)} placeholder="Or type your own answer..." style={{ width: '100%', padding: '14px 16px', background: '#18181b', border: '1px dashed #3f3f46', borderRadius: '12px', color: 'white', fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          </div>
        )}
        
        {profileSetupStep === 3 && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>✨</div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '6px' }}>Your room vibe?</h2>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>How does your space usually look</p>
            <div style={{ display: 'grid', gap: '10px', marginBottom: '12px' }}>
              {['Clean Freak', 'Pinterest Perfect', 'Organized Chaos', 'Floor is Storage'].map(opt => (
                <button key={opt} onClick={() => setProfileVibe(opt)} style={{ padding: '16px', background: profileVibe === opt ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' : '#18181b', border: profileVibe === opt ? 'none' : '1px solid #27272a', borderRadius: '14px', color: 'white', cursor: 'pointer', textAlign: 'left', fontSize: '14px', fontFamily: 'inherit', fontWeight: profileVibe === opt ? 700 : 400 }}>{opt}</button>
              ))}
            </div>
            <input value={['Clean Freak', 'Pinterest Perfect', 'Organized Chaos', 'Floor is Storage'].includes(profileVibe) ? '' : profileVibe} onChange={e => setProfileVibe(e.target.value)} placeholder="Or type your own answer..." style={{ width: '100%', padding: '14px 16px', background: '#18181b', border: '1px dashed #3f3f46', borderRadius: '12px', color: 'white', fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          </div>
        )}

        {profileSetupStep === 4 && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌿</div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '6px' }}>Dietary preference?</h2>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>So your roommate knows the kitchen vibe</p>
            <div style={{ display: 'grid', gap: '10px', marginBottom: '12px' }}>
              {['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggetarian'].map(opt => (
                <button key={opt} onClick={() => setProfileDiet(opt)} style={{ padding: '16px', background: profileDiet === opt ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' : '#18181b', border: profileDiet === opt ? 'none' : '1px solid #27272a', borderRadius: '14px', color: 'white', cursor: 'pointer', textAlign: 'left', fontSize: '14px', fontFamily: 'inherit', fontWeight: profileDiet === opt ? 700 : 400 }}>{opt}</button>
              ))}
            </div>
            <input value={['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggetarian'].includes(profileDiet) ? '' : profileDiet} onChange={e => setProfileDiet(e.target.value)} placeholder="Or type your own answer..." style={{ width: '100%', padding: '14px 16px', background: '#18181b', border: '1px dashed #3f3f46', borderRadius: '12px', color: 'white', fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          </div>
        )}
        {profileSetupStep === 5 && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>💰</div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '6px' }}>Your budget range?</h2>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>Monthly rent you're comfortable with</p>
            <input value={profileBudget} onChange={e => setProfileBudget(e.target.value)} placeholder="e.g. ₹6k–9k/mo" style={{ width: '100%', padding: '16px', background: '#18181b', border: '1px solid #27272a', borderRadius: '14px', color: 'white', fontSize: '16px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: '20px' }} />
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          {profileSetupStep > 0 && (
            <button onClick={() => setProfileSetupStep(s => s - 1)} style={{ padding: '15px 20px', background: '#18181b', border: '1px solid #27272a', borderRadius: '14px', color: '#9ca3af', cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit' }}>←</button>
          )}
          <button onClick={() => setProfileSetupStep(s => s + 1)} style={{ flex: 1, padding: '15px', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', border: 'none', borderRadius: '14px', color: 'white', fontSize: '15px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
            {profileSetupStep === 5 ? "Let's Go! 🚀" : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );     
if (userRole === 'host' && !myListing) return (
    <div style={{ background: '#09090b', minHeight: '100vh', color: 'white', fontFamily: 'Segoe UI, sans-serif', padding: '20px' }}>
      <div style={{ maxWidth: '420px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <button onClick={() => setUserRole(null)} style={{ background: 'none', border: 'none', color: '#EC4899', cursor: 'pointer', fontSize: '20px' }}>←</button>
          <h1 style={{ fontSize: '20px', fontWeight: 900 }}>🏠 List Your Room</h1>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: 700 }}>📸 ROOM PHOTOS</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {listingImages.map((img, i) => (
              <img key={i} src={img} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '12px' }} />
            ))}
            <label style={{ width: '70px', height: '70px', borderRadius: '12px', border: '2px dashed #3f3f46', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280', fontSize: '20px' }}>
              {uploadingImage ? '⏳' : '+'}
              <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={async (e) => {
                if (!e.target.files?.length) return;
                setUploadingImage(true);
                for (const file of Array.from(e.target.files)) {
                  const formData = new FormData();
                  formData.append('image', file);
                  try {
                    const res = await fetch('https://roomateai.onrender.com/api/upload', { method: 'POST', body: formData });
                    const data = await res.json();
                    setListingImages(prev => [...prev, data.url]);
                  } catch {}
                }
                setUploadingImage(false);
              }} />
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <input value={listingPrice} onChange={e => setListingPrice(e.target.value)} placeholder="Rent (e.g. 7500)" type="number" style={{ padding: '14px 16px', background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          <input value={listingLocation} onChange={e => setListingLocation(e.target.value)} placeholder="Location (e.g. Koregaon Park, Pune)" style={{ padding: '14px 16px', background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          <select value={listingType} onChange={e => setListingType(e.target.value)} style={{ padding: '14px 16px', background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}>
            <option>1BHK</option>
            <option>2BHK</option>
            <option>3BHK</option>
          </select>
        </div>

        <button onClick={() => {
          if (!listingPrice || !listingLocation) return alert('Please fill price and location!');
          setMyListing({
            id: 999,
            price: `₹${listingPrice}`,
            location: listingLocation,
            type: listingType,
            match: 100,
            image: listingImages[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
            badge: '🆕 Your Listing',
            badgeColor: '#10B981',
            name: currentUser.name,
            dept: profileCollege,
            tags: [profileVibe, profileSocial],
            color: '#10B981'
          });
          setUploadedImages(prev => ({ ...prev, 999: listingImages }));
        }} style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', border: 'none', borderRadius: '14px', color: 'white', fontSize: '15px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
          Publish Listing ✨
        </button>
      </div>
    </div>
  );
  return (
    <div style={{ background: '#09090b', minHeight: '100vh', color: 'white', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Nav */}
      <nav style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ffffff10', position: 'sticky', top: 0, background: '#09090bdd', backdropFilter: 'blur(20px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #EC4899, #8B5CF6, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🏠</div>
          <span style={{ fontSize: '18px', fontWeight: 900, background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>RoommateAI</span>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', marginBottom: '8px' }}></div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
       {currentUser ? (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <span style={{ fontSize: '13px', color: '#9ca3af' }}>👋 {currentUser.name?.split(' ')[0]}</span>
    <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); setCurrentUser(null); }} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #ffffff30', borderRadius: '20px', color: 'white', cursor: 'pointer', fontSize: '13px' }}>Logout</button>
  </div>
) : (
  <>
    <button onClick={() => { setShowAuth(true); setAuthMode('login'); }} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #ffffff30', borderRadius: '20px', color: 'white', cursor: 'pointer', fontSize: '13px' }}>Login</button>
    <button onClick={() => { setShowAuth(true); setAuthMode('signup'); }} style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', border: 'none', borderRadius: '20px', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>Get Started →</button>
  </>
)}  
        </div>
      </nav>

      {/* Tab Bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid #27272a', background: '#09090b', position: 'sticky', top: '65px', zIndex: 99, overflowX: 'auto' }}>
        {['explore', 'matches', 'chat', 'profile'].map(t => (
          <div key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '12px', textAlign: 'center', fontSize: '13px', cursor: 'pointer', borderBottom: tab === t ? '2px solid #EC4899' : '2px solid transparent', color: tab === t ? '#EC4899' : '#6b7280', fontWeight: tab === t ? 700 : 400, whiteSpace: 'nowrap', minWidth: '80px', textTransform: 'capitalize' }}>
            {t === 'explore' ? '🔍 Explore' : t === 'matches' ? '💜 Matches' : t === 'chat' ? '💬 Chat' : '✨ Profile'}
          </div>
        ))}
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px 16px' }}>

        {/* EXPLORE */}
        {tab === 'explore' && (
          <div>
            <div style={{ padding: '8px 0 16px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '4px' }}>Find your vibe 🔥</h2>
              <p style={{ fontSize: '13px', color: '#6b7280' }}>AI-matched flats near you</p>
            </div>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="🔍 Search city, area, college..." style={{ width: '100%', padding: '12px 16px', background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none', marginBottom: '12px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '16px', paddingBottom: '4px' }}>
              {chips.map(c => (
                <div key={c} onClick={() => setActiveChip(c)} style={{ padding: '7px 14px', borderRadius: '20px', fontSize: '12px', whiteSpace: 'nowrap', cursor: 'pointer', border: activeChip === c ? 'none' : '1px solid #27272a', background: activeChip === c ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' : 'transparent', color: activeChip === c ? 'white' : '#9ca3af', fontWeight: activeChip === c ? 700 : 400 }}>
                  {c}
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 20px', background: `linear-gradient(135deg, ${personalities[activeP].color}20, transparent)`, border: `1px solid ${personalities[activeP].color}40`, borderRadius: '50px', transition: 'all 0.5s' }}>
                <span style={{ fontSize: '22px' }}>{personalities[activeP].emoji}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 800, color: personalities[activeP].color, fontSize: '14px' }}>{personalities[activeP].type}</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>{personalities[activeP].desc}</div>
                </div>
              </div>
            </div>
            
            {flats.filter(f => {
  const matchSearch = searchQuery === '' || 
    f.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.name.toLowerCase().includes(searchQuery.toLowerCase());
  const matchChip = activeChip === 'All' ? true :
    activeChip === 'Under ₹8k' ? parseInt(f.price.replace(/[₹,]/g, '')) < 8000 :
    activeChip === 'Girls Only' ? (f.name.includes('Priya') || f.name.includes('Sneha')) :
    activeChip === 'Near College' ? (f.location.includes('Baner') || f.location.includes('Viman')) :
    activeChip === 'AC Room' ? f.id !== 2 : true;
  return matchSearch && matchChip;
}).map(flat => (
              <div key={flat.id} onClick={() => { setSelectedFlat(flat); setActiveImageIndex(0); }} style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '20px', marginBottom: '14px', overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
 <img src={uploadedImages[flat.id]?.[0] || flat.image} alt={flat.location} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')} onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 50%, #18181b)` }} />
                <div style={{ position: 'absolute', top: '12px', left: '12px', background: flat.badgeColor, color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>{flat.badge}</div>
                  <div onClick={(e) => { e.stopPropagation(); setSavedFlats(prev => prev.includes(flat.id) ? prev.filter(id => id !== flat.id) : [...prev, flat.id]); }} style={{ position: 'absolute', top: '10px', right: '10px', padding: '6px 10px', borderRadius: '20px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 600, color: savedFlats.includes(flat.id) ? '#EC4899' : 'white' }}>
                    {savedFlats.includes(flat.id) ? '✓ Saved' : '+ Save'}
                  </div>
                </div>
                <div style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '20px', fontWeight: 900, background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{flat.price}<span style={{ fontSize: '12px', color: '#9ca3af', WebkitTextFillColor: '#9ca3af' }}>/mo</span></div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>📍 {flat.location} · {flat.type}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '20px', fontWeight: 900, color: '#10B981' }}>{flat.match}%</div>
                      <div style={{ fontSize: '10px', color: '#6b7280' }}>Match</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
                    {flat.tags.map(tag => (
                      <span key={tag} style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: `${flat.color}20`, color: flat.color, fontWeight: 600 }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>Looking for</div>
                      <div style={{ fontSize: '13px', fontWeight: 700 }}>{flat.name} · {flat.dept}</div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setSelectedFlat(flat); }} style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', border: 'none', borderRadius: '20px', color: 'white', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Connect ✨</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MATCHES */}
        {tab === 'matches' && (
          <div>
            <div style={{ padding: '8px 0 16px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 900 }}>Your Matches 💜</h2>
              <p style={{ fontSize: '13px', color: '#6b7280' }}>AI found these based on your vibe</p>
            </div>
            {[
              { name: "Priya S.", dept: "CSE · 3rd yr", score: 94, color: "#EC4899", emoji: "👩", type: "🦉 Night Owl" },
              { name: "Anjali R.", dept: "IT · 2nd yr", score: 89, color: "#8B5CF6", emoji: "👩‍💻", type: "✨ Clean Freak" },
              { name: "Rahul K.", dept: "Mech · 4th yr", score: 82, color: "#3B82F6", emoji: "👨", type: "🐢 Hermit" },
              { name: "Meera T.", dept: "CS · 1st yr", score: 76, color: "#10B981", emoji: "👩‍🎨", type: "🦋 Social" },
            ].map((m, i) => (
              <div key={i} style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '14px', marginBottom: '10px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: `linear-gradient(135deg, ${m.color}, #8B5CF6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>{m.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>{m.name}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0' }}>{m.dept}</div>
                  <span style={{ fontSize: '11px', background: `${m.color}20`, color: m.color, padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>{m.type}</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#10B981' }}>{m.score}%</div>
                  <button onClick={() => { setChatOpen(true); setSelectedFlat({ name: m.name, match: m.score }); }} style={{ padding: '6px 12px', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', border: 'none', borderRadius: '20px', color: 'white', fontSize: '11px', fontWeight: 700, cursor: 'pointer', marginTop: '4px' }}>Chat</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CHAT LIST */}
        {tab === 'chat' && (
          <div>
            <div style={{ padding: '8px 0 16px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 900 }}>Messages 💬</h2>
              <p style={{ fontSize: '13px', color: '#6b7280' }}>AI icebreakers included ✨</p>
            </div>
            {[
              { name: "Priya S.", msg: "Hey! Saw your profile 👀", time: "2m", unread: 2, emoji: "👩", color: "#EC4899" },
              { name: "Anjali R.", msg: "AI said we'd be perfect roomies!", time: "1h", unread: 1, emoji: "👩‍💻", color: "#8B5CF6" },
              { name: "Rahul K.", msg: "Is the flat still available?", time: "3h", unread: 0, emoji: "👨", color: "#3B82F6" },
              { name: "Meera T.", msg: "Love your vibe! 🌙", time: "1d", unread: 0, emoji: "👩‍🎨", color: "#10B981" },
            ].map((c, i) => (
              <div key={i} onClick={() => { setChatOpen(true); setSelectedFlat({ name: c.name, match: 94 }); }} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #27272a', cursor: 'pointer' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `linear-gradient(135deg, ${c.color}, #8B5CF6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{c.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{c.name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.msg}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <div style={{ fontSize: '11px', color: '#4b5563' }}>{c.time}</div>
                  {c.unread > 0 && <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.unread}</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PROFILE */}
        {tab === 'profile' && (
          <div>
           <div style={{ background: 'linear-gradient(135deg, #EC4899, #8B5CF6, #3B82F6)', borderRadius: '24px', padding: '32px 24px', textAlign: 'center', marginBottom: '16px', position: 'relative', overflow: 'hidden', boxShadow: '0 0 60px #8B5CF640' }}>
              <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, #ffffff15 0%, transparent 70%)', animation: 'pulse 3s ease-in-out infinite' }} />
             <label style={{ width: '80px', height: '80px', borderRadius: '50%', background: profilePhoto ? `url(${profilePhoto})` : 'white', backgroundSize: 'cover', backgroundPosition: 'center', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', position: 'relative', boxShadow: '0 8px 20px rgba(0,0,0,0.3)', cursor: 'pointer' }}>
                {!profilePhoto && '👩‍💻'}
                <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '26px', height: '26px', borderRadius: '50%', background: '#EC4899', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', border: '2px solid #18181b' }}>📷</div>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                  if (!e.target.files?.[0]) return;
                  const formData = new FormData();
                  formData.append('image', e.target.files[0]);
                  try {
                    const res = await fetch('https://roomateai.onrender.com/api/upload', {
                      method: 'POST',
                      body: formData
                    });
                    const data = await res.json();
                    setProfilePhoto(data.url);
                  } catch {
                    alert('Upload failed!');
                  }
                }} />
              </label>
              <div style={{ fontSize: '22px', fontWeight: 900, position: 'relative' }}>{profileName}</div>
              <div style={{ fontSize: '13px', opacity: 0.85, margin: '4px 0 12px', position: 'relative' }}>{profileCollege}</div>
              <div style={{ background: '#ffffff25', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '6px 16px', display: 'inline-block', fontSize: '12px', fontWeight: 700, position: 'relative', border: '1px solid #ffffff30' }}>🦉 The Night Owl</div>
            </div>
<div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: '#6b7280', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 700 }}>YOUR ROOMMATE DNA 🧬</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[['🌙', 'Sleep', profileSleep, '#8B5CF6'], ['📚', 'Study', profileStudy, '#3B82F6'], ['✨', 'Vibe', profileVibe, '#EC4899'], ['🐢', 'Social', profileSocial, '#10B981'], ['🌿', 'Diet', profileDiet, '#F59E0B'], ['💰', 'Budget', profileBudget, '#EF4444']].map(([icon, l, v, c]) => (
                  <div key={l} style={{ background: `${c}15`, border: `1px solid ${c}30`, borderRadius: '14px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '22px', marginBottom: '4px' }}>{icon}</div>
                    <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{l}</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: c, marginTop: '2px' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '16px', marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', color: '#6b7280', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 700 }}>VIBE QUIZ 🎭</div>
              {!quizResult ? (
                <div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px' }}>{quizStep + 1}/{quiz.length}</div>
                  <div style={{ height: '3px', background: '#27272a', borderRadius: '2px', marginBottom: '16px' }}>
                    <div style={{ height: '100%', width: `${(quizStep / quiz.length) * 100}%`, background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', borderRadius: '2px' }} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px' }}>{quiz[quizStep].q}</h3>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {quiz[quizStep].opts.map(opt => (
                      <button key={opt} onClick={() => handleQuiz(opt)} style={{ padding: '12px 14px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '10px', color: 'white', cursor: 'pointer', textAlign: 'left', fontSize: '13px', fontFamily: 'inherit' }}>{opt}</button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>{quizResult.emoji}</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: quizResult.color, marginBottom: '6px' }}>{quizResult.type}</div>
                  <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '14px' }}>{quizResult.desc}</div>
                  <button onClick={() => { setQuizStep(0); setQuizResult(null); }} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #27272a', borderRadius: '20px', color: '#9ca3af', cursor: 'pointer', fontSize: '13px' }}>Retake Quiz</button>
                </div>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              {[['12', 'Matches', '#EC4899'], ['4', 'Chats', '#8B5CF6'], ['4.9★', 'Rating', '#10B981']].map(([n, l, c]) => (
                <div key={l} style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: c }}>{n}</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>{l}</div>
                </div>
              ))}
            </div>
<button onClick={() => setVoiceModal(true)} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', border: 'none', borderRadius: '14px', color: 'white', fontSize: '15px', fontWeight: 800, cursor: 'pointer', marginBottom: '8px' }}>
  🎙️ Record Voice Vibe Check
</button>
            <button onClick={() => setEditProfile(true)} style={{ width: '100%', padding: '14px', background: '#18181b', border: '1px solid #27272a', borderRadius: '14px', color: '#9ca3af', fontSize: '14px', cursor: 'pointer' }}>
  ✏️ Edit Profile
</button>
            <div style={{ background: 'linear-gradient(135deg, #EC489915, #8B5CF615)', border: '1px solid #ffffff15', borderRadius: '16px', padding: '20px', marginTop: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚀</div>
              <div style={{ fontWeight: 700, marginBottom: '4px' }}>Join the Waitlist</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '14px' }}>Launching in Mumbai, Delhi, Bangalore first!</div>
              {!joined ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={{ flex: 1, padding: '10px 12px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '10px', color: 'white', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }} />
                  <button onClick={() => email && setJoined(true)} style={{ padding: '10px 16px', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>Join ✨</button>
                </div>
              ) : (
                <div style={{ background: '#10B98120', border: '1px solid #10B981', borderRadius: '10px', padding: '12px', color: '#10B981', fontWeight: 700 }}>🎉 You're on the list!</div>
              )}
            </div>
          </div>
        )}

      </div>
{/* Edit Profile Modal */}
{editProfile && (
  <div onClick={() => setEditProfile(false)} style={{ position: 'fixed', inset: 0, background: '#000000aa', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
    <div onClick={e => e.stopPropagation()} style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '24px', padding: '28px', width: '100%', maxWidth: '380px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '20px', textAlign: 'center' }}>✏️ Edit Profile</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Name</div>
          <input value={profileName} onChange={e => setProfileName(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>College & Year</div>
          <input value={profileCollege} onChange={e => setProfileCollege(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
      <div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Budget</div>
          <input value={profileBudget} onChange={e => setProfileBudget(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>🌙 Sleep Time</div>
          <select value={profileSleep} onChange={e => setProfileSleep(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}>
            <option>Before 11PM</option>
            <option>11PM–1AM</option>
            <option>After 1AM</option>
            <option>Sleep is a myth</option>
          </select>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>📚 Study Style</div>
          <select value={profileStudy} onChange={e => setProfileStudy(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}>
            <option>Dead Silence</option>
            <option>Lo-fi Music</option>
            <option>Coffee Shop Gang</option>
            <option>Chaos Around Me</option>
          </select>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>✨ Room Vibe</div>
          <select value={profileVibe} onChange={e => setProfileVibe(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}>
            <option>Clean Freak</option>
            <option>Pinterest Perfect</option>
            <option>Organized Chaos</option>
            <option>Floor is Storage</option>
          </select>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>🐢 Social Level</div>
          <select value={profileSocial} onChange={e => setProfileSocial(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}>
            <option>Social Butterfly</option>
            <option>Selective</option>
            <option>Rare Occasions</option>
            <option>Hermit Mode</option>
          </select>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>🌿 Diet</div>
          <select value={profileDiet} onChange={e => setProfileDiet(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}>
            <option>Vegetarian</option>
            <option>Non-Vegetarian</option>
            <option>Vegan</option>
            <option>Eggetarian</option>
          </select>
        </div>
      </div>
      <button onClick={() => setEditProfile(false)} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', border: 'none', borderRadius: '14px', color: 'white', fontSize: '15px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
        Save Changes ✨
      </button>  
    </div>
  </div>
)}
{/* Voice Modal */}
{voiceModal && (
  <div onClick={() => { setVoiceModal(false); setVoiceResult(null); setVoiceTranscript(''); }} style={{ position: 'fixed', inset: 0, background: '#000000aa', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
    <div onClick={e => e.stopPropagation()} style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '24px', padding: '28px', width: '100%', maxWidth: '380px', textAlign: 'center' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '8px' }}>🎙️ Voice Vibe Check</h2>
      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>Tell us about yourself — AI will analyze your vibe!</p>
      {!voiceResult ? (
        <div>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>{recording ? '🔴' : '🎙️'}</div>
         <p style={{ fontSize: '13px', color: recording ? '#EF4444' : '#6b7280', marginBottom: '20px' }}>
{recording ? 'Recording... say anything about yourself!' : 'Press the button and talk about yourself'}
</p>
          {voiceTranscript && (
            <div style={{ background: '#27272a', borderRadius: '12px', padding: '12px', marginBottom: '16px', fontSize: '13px', color: '#9ca3af', textAlign: 'left' }}>
              "{voiceTranscript}"
            </div>
          )}
          <button onClick={() => {
            if (recording) return;
            setRecording(true);
            setVoiceTranscript('');
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (!SpeechRecognition) { alert('Browser speech not supported!'); setRecording(false); return; }
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-IN';
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.onresult = async (event: any) => {
              const transcript = event.results[0][0].transcript;
              setVoiceTranscript(transcript);
              setRecording(false);
              try {
                const res = await fetch('https://roomateai.onrender.com/api/analyze-voice', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ transcript })
                });
                const data = await res.json();
                setVoiceResult(data);
              } catch {
                setVoiceResult({ type: 'The Night Owl', emoji: '🦉', color: '#8B5CF6', desc: 'Sleeps at 3AM, vibes at midnight' });
              }
            };
            recognition.onerror = () => setRecording(false);
            recognition.start();
          }} style={{ width: '100%', padding: '16px', background: recording ? '#EF4444' : 'linear-gradient(135deg, #EC4899, #8B5CF6)', border: 'none', borderRadius: '14px', color: 'white', fontSize: '15px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
            {recording ? '🔴 Recording...' : '🎙️ Start Recording'}
          </button>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '64px', marginBottom: '12px' }}>{voiceResult.emoji}</div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: voiceResult.color, marginBottom: '8px' }}>{voiceResult.type}</div>
          <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '20px' }}>{voiceResult.desc}</div>
          <div style={{ background: '#10B98115', border: '1px solid #10B98130', borderRadius: '12px', padding: '12px', marginBottom: '20px', fontSize: '13px', color: '#d1fae5' }}>
            {voiceResult.analysis}
          </div>
          <button onClick={() => { setVoiceResult(null); setVoiceTranscript(''); }} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', border: 'none', borderRadius: '14px', color: 'white', fontSize: '15px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', marginBottom: '8px' }}>
            🔄 Try Again
          </button>
          <button onClick={() => setVoiceModal(false)} style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid #27272a', borderRadius: '14px', color: '#9ca3af', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
            ✅ Save to Profile
          </button>
        </div>
      )}
    </div>
  </div>
)}
      {/* Auth Modal */}
      {showAuth && (
        <div onClick={() => setShowAuth(false)} style={{ position: 'fixed', inset: 0, background: '#000000aa', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '24px', padding: '28px', width: '100%', maxWidth: '380px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏠</div>
              <h2 style={{ fontSize: '22px', fontWeight: 900, background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {authMode === 'login' ? 'Welcome Back!' : 'Join RoommateAI'}
              </h2>
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                {authMode === 'login' ? 'Login to find your perfect roommate' : 'Find your perfect roommate with AI'}
              </p>
            </div>
            <div style={{ display: 'flex', background: '#27272a', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
              {(['login', 'signup'] as const).map(mode => (
                <button key={mode} onClick={() => setAuthMode(mode)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700, background: authMode === mode ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' : 'transparent', color: authMode === mode ? 'white' : '#6b7280', fontFamily: 'inherit' }}>
                  {mode === 'login' ? 'Login' : 'Sign Up'}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
             {authMode === 'signup' && (
  <input value={authName} onChange={e => setAuthName(e.target.value)} placeholder="Full Name" style={{ padding: '12px 16px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }} />
)}
<input value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="Email" type="email" style={{ padding: '12px 16px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }} />
<input value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder="Password" type="password" style={{ padding: '12px 16px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }} />
{authError && <p style={{ color: '#EF4444', fontSize: '12px', margin: 0 }}>{authError}</p>}
            </div>
           <button onClick={async () => {
  setAuthError('');
  if (!authEmail || !authPassword) return setAuthError('Email and password are required!');
if (authMode === 'signup' && !authName) return setAuthError('Name is required!');
setAuthLoading(true);
  try {
    const res = await fetch(`https://roomateai.onrender.com/api/auth/${authMode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: authName, email: authEmail, password: authPassword })
    });
    const data = await res.json();
    if (data.error) {
      setAuthError(data.error);
    } else {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setCurrentUser(data.user);
      setShowAuth(false);
    }
  } catch {
    setAuthError('Something went wrong!');
  } finally {
    setAuthLoading(false);
  }
}} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', border: 'none', borderRadius: '14px', color: 'white', fontSize: '15px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', opacity: authLoading ? 0.7 : 1 }}>
  {authLoading ? '⏳ Please wait...' : authMode === 'login' ? 'Login →' : 'Create Account →'}
</button>
            <p style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280', marginTop: '16px' }}>
              {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <span onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} style={{ color: '#EC4899', cursor: 'pointer', fontWeight: 700 }}>
                {authMode === 'login' ? 'Sign Up' : 'Login'}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
