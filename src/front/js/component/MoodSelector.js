import React, { useState } from 'react';

const MoodSelector = () => {
  const [quote, setQuote] = useState('');

  const handleMoodClick = async (mood) => {
    try {
        const response = await fetch(`https://glorious-space-barnacle-rwqjwpprjvg3pv96-3001.app.github.dev/api/quotes?mood=${mood}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setQuote(data.quote); // Set the quote state with the fetched quote
    } catch (error) {
        console.error('Error fetching quote:', error);
        setQuote('Error fetching quote. Please try again.'); // Handle error case
    }
};

  return (
    <div className='moveFooter'>
      <h2 className='text-2 pt-5'>How are you feeling today?</h2>
      <div>
        <button type='button' className="btn btn-outline-secondary me-2 mt-2" onClick={() => handleMoodClick('fantastic')}>
          😊 Feeling fantastic
        </button>
        <button type='button' className="btn btn-outline-secondary me-2 mt-2" onClick={() => handleMoodClick('sad')}>
          😢 Feeling sad
        </button>
        <button type='button' className="btn btn-outline-secondary mt-2" onClick={() => handleMoodClick('unknown')}>
          🤔 I don't know
        </button>
      </div>
      {quote && (
        <div>
          <h3 className='pt-4 desc'>Just for you : 👇</h3>
          <p className='text-2 fs-4'>{quote}</p>
        </div>
      )}
    </div>
  );
};

export default MoodSelector;
