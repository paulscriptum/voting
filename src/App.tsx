import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjnSSs2KOwJvA8qBq2FeBflL11BYjRTyk",
  authDomain: "porsche-voting-app.firebaseapp.com",
  databaseURL: "https://porsche-voting-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "porsche-voting-app",
  storageBucket: "porsche-voting-app.firebasestorage.app",
  messagingSenderId: "305556950394",
  appId: "1:305556950394:web:870b4429a635ecd5565ac3",
  measurementId: "G-SRSEFGKN8M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function App() {
  const [voteSelection, setVoteSelection] = useState<'ev' | 'benzin' | null>(null);
  const [showThanks, setShowThanks] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Function to save vote to Firebase
  const saveVote = (selection: 'ev' | 'benzin') => {
    if (isAnimating) return; // Prevent voting during animation

    setIsAnimating(true);
    const timestamp = new Date().toISOString();
    const voteData = { 
      selection, 
      timestamp,
      userAgent: navigator.userAgent,
      date: new Date().toLocaleString()
    };
    
    const customId = `${selection}_${Date.now()}`;
    const votesRef = ref(database, `votes2/${customId}`);
    
    set(votesRef, voteData)
      .then(() => {
      setVoteSelection(selection);
      setShowThanks(true);
  
      // Reset states after animation
      setTimeout(() => {
        setShowThanks(false);
        setVoteSelection(null);
        setIsAnimating(false);
      }, 2000);
    })
    .catch((error) => {
    console.error('Error saving vote:', error);
    setIsAnimating(false);
  });
};

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isAnimating) return; // Prevent voting during animation
      
      if (event.key === 'ArrowLeft') {
        saveVote('ev');
      } else if (event.key === 'ArrowRight') {
        saveVote('benzin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnimating]); // Add isAnimating to dependencies

  return (
    <>
      <div className="background-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
            </div>

      <div className="min-h-screen text-white relative overflow-hidden flex items-center justify-center">
        <div className={`voting-popup-content bg-zinc-900 p-10 rounded-xl ${isAnimating ? 'animate-vote' : ''}`}>
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-[#C39A6B]">
              Which do you prefer?
            </h1>
                  </div>

          <div className="flex justify-center gap-8 mb-6">
            {/* EV Option */}
              <button
              onClick={() => !isAnimating && saveVote('ev')}
              className={`voting-popup-option cursor-pointer p-8 rounded-xl bg-zinc-800 relative flex justify-center items-center w-[400px] transition-all duration-200 ${
                voteSelection === 'ev' ? 'selected bg-[#D5001C]' : 'hover:bg-zinc-700'
              }`}
            >
              <div className="voting-popup-option-text text-2xl font-bold text-white pointer-events-none">
                ELECTRIC
              </div>
              </button>
              
            {/* Benzin Option */}
            <button
              onClick={() => !isAnimating && saveVote('benzin')}
              className={`voting-popup-option cursor-pointer p-8 rounded-xl bg-zinc-800 relative flex justify-center items-center w-[400px] transition-all duration-200 ${
                voteSelection === 'benzin' ? 'selected bg-[#D5001C]' : 'hover:bg-zinc-700'
              }`}
            >
              <div className="voting-popup-option-text text-2xl font-bold text-white pointer-events-none">
                BENZIN
                      </div>
            </button>
                    </div>
                    
          <div className="text-center">
            {showThanks ? (
              <div className="text-xl text-green-500 font-bold voting-popup-footer-text thanks">
                Thanks for your vote!
                        </div>
                      ) : (
              <div className="text-xl text-[#C39A6B] voting-popup-footer-text">
                Your vote matters
                        </div>
                      )}
                    </div>
                      </div>
                      </div>
    </>
  );
}

export default App;