// import { useState } from 'react';
// import { api } from '../utils/api';
// export default function Workspace() {
//   const [url, setUrl] = useState('');
//   const [content, setContent] = useState('');
//   const handleScrape = async () => {
//     const res = await api.post('/workspace/scrape', { url });
//     setContent(res.data.content);
//   };
//   return (
//     <div className="p-6">
//       <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Enter website URL" className="border p-2" />
//       <button onClick={handleScrape} className="ml-2 bg-blue-500 text-white p-2">Scrape</button>
//       <pre className="mt-4 whitespace-pre-wrap">{content}</pre>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Workspace() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const email = token.split('.')[1];
        // proceed with decoding or logic
      } else {
        console.error('Token is null or undefined');
      }
    //   const decoded = JSON.parse(atob(token.split('.')[1]));
    //   const email = decoded.email;
  
      try {
        const res = await axios.get(`http://localhost:8000/api/team/members/${email}`);
        console.log('Team members:', res.data.members);
      } catch (err) {
        console.error('Failed to load team');
      }
    };
  
    fetchTeam();
  }, []);
  
  // ✏️ Add invitedBy to handleInvite in workspace.js
  const handleInvite = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const email = decoded.email;
  
      await axios.post('http://localhost:8000/api/team/invite', {
        email: inviteEmail,
        invitedBy: email
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInviteMsg('Team member invited successfully.');
    } catch (err) {
      setInviteMsg('Failed to invite member.');
    }
  };
  

  const handleScrape = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:8000/api/workspace/scrape', { url }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus('Scraping successful');
    } catch (error) {
      setStatus('Scraping failed');
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Workspace</h1>
      <input
        type="text"
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="Enter website URL to scrape"
        className="border p-2 rounded w-full max-w-xl mb-4"
      />
      <button
        onClick={handleScrape}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Scraping...' : 'Scrape Content'}
      </button>
      <p className="mt-4 text-green-600">{status}</p>
    </div>
  );
}


