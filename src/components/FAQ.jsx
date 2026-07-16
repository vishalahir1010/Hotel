import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQ_DATA = [
  {
    question: 'What is the check-in and check-out time structure?',
    answer: 'Standard check-in is at 3:00 PM and check-out is at 12:00 PM. VIP guests (Presidential Suite, Aurelia Penthouse, overwater villas) enjoy priority flexible 24-hour arrivals and late check-outs, arranged with their private butler.'
  },
  {
    question: 'How do I organize helipad transfers or yacht pickups?',
    answer: 'You can book private helipad pickups and luxury boat transfers during checkout (Step 1 Addons) or by contacting our 24/7 VIP Concierge Desk. Our resort hosts a private cliff helipad and deep-water dock.'
  },
  {
    question: 'Are children allowed in pool villas and penthouses?',
    answer: 'Aurelia is a sanctuary designed for adults seeking tranquility. Children aged 12 and older are welcome. Certain secluded pool villas are adult-only to ensure absolute peace and sensory quietness for nearby residents.'
  },
  {
    question: 'What is included in the Resort Amenities Fee?',
    answer: 'The daily resort fee ($45) covers high-speed satellite Wi-Fi, unlimited non-motorized watersports (kayaks, paddleboards), daily sunrise yoga sessions, in-suite sommelier wine tastings, and access to all heated hydrotherapy pools.'
  },
  {
    question: 'Is there a dress code for the Michelin-starred dining salons?',
    answer: 'Yes, our signature restaurant Carlo Rossi’s Astral Salon enforces a Smart Elegant dress code. Collared shirts and closed-toed shoes are required for gentlemen. Athletic wear, sandals, and beachwear are not permitted.'
  }
];

export const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const toggleFAQ = (idx) => {
    if (openIdx === idx) {
      setOpenIdx(null);
    } else {
      setOpenIdx(idx);
    }
  };

  return (
    <section id="faq" className="faq-section">
      <div className="rooms-header animate-fade-in" style={{ marginBottom: '40px' }}>
        <span className="section-tag">Sanctuary Queries</span>
        <h2 className="section-title">Frequently Asked <span className="gold-text">Questions</span></h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '15px auto 0' }}>
          Got questions about our luxury services, arrival transfers, or cancellation details? We have answers.
        </p>
      </div>

      <div className="faq-container animate-fade-in">
        {FAQ_DATA.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div 
              key={idx} 
              className={`faq-item ${isOpen ? 'open' : ''}`}
            >
              <div 
                className="faq-question" 
                onClick={() => toggleFAQ(idx)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <HelpCircle size={18} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{faq.question}</span>
                </div>
                {isOpen ? (
                  <ChevronUp size={18} style={{ color: 'var(--gold-primary)' }} />
                ) : (
                  <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />
                )}
              </div>
              
              {isOpen && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
export default FAQ;
