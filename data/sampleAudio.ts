// Sample audio files for testing the music player
export const sampleAudioFiles = [
  {
    id: 'sample1',
    title: 'Bell Ringing',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 60,
  },
  {
    id: 'sample2',
    title: 'Magic Chime',
    url: 'https://www.soundjay.com/misc/sounds/magic-chime-02.wav',
    duration: 60,
  },
  {
    id: 'sample3',
    title: 'Clock Chimes',
    url: 'https://www.soundjay.com/misc/sounds/clock-chimes-1.wav',
    duration: 60,
  },
  {
    id: 'sample4',
    title: 'Typewriter Key',
    url: 'https://www.soundjay.com/misc/sounds/typewriter-key-1.wav',
    duration: 60,
  },
  {
    id: 'sample5',
    title: 'Water Drop',
    url: 'https://www.soundjay.com/misc/sounds/water-drop-1.wav',
    duration: 60,
  },
  {
    id: 'sample6',
    title: 'Wind Chimes',
    url: 'https://www.soundjay.com/misc/sounds/wind-chimes-1.wav',
    duration: 60,
  },
  {
    id: 'sample7',
    title: 'Piano Key',
    url: 'https://www.soundjay.com/misc/sounds/piano-key-1.wav',
    duration: 60,
  },
  {
    id: 'sample8',
    title: 'Laser Zap',
    url: 'https://www.soundjay.com/misc/sounds/laser-zap-1.wav',
    duration: 60,
  },
  {
    id: 'sample9',
    title: 'Singing Bowl',
    url: 'https://www.soundjay.com/misc/sounds/singing-bowl-1.wav',
    duration: 60,
  },
  {
    id: 'sample10',
    title: 'Drum Beat',
    url: 'https://www.soundjay.com/misc/sounds/drum-beat-1.wav',
    duration: 60,
  },
  {
    id: 'sample11',
    title: 'Record Scratch',
    url: 'https://www.soundjay.com/misc/sounds/record-scratch-1.wav',
    duration: 60,
  },
  {
    id: 'sample12',
    title: 'Computer Beep',
    url: 'https://www.soundjay.com/misc/sounds/computer-beep-1.wav',
    duration: 60,
  },
  {
    id: 'sample13',
    title: 'Ding Idea',
    url: 'https://www.soundjay.com/misc/sounds/ding-idea-40142.wav',
    duration: 60,
  },
  {
    id: 'sample14',
    title: 'Beep Alert',
    url: 'https://www.soundjay.com/misc/sounds/beep-07a.wav',
    duration: 60,
  },
  {
    id: 'sample15',
    title: 'Fail Buzzer',
    url: 'https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav',
    duration: 60,
  },
  // Additional diverse sounds for testing
  {
    id: 'sample16',
    title: 'Nature Birds',
    url: 'https://www.soundjay.com/nature/sounds/birds-chirping-1.wav',
    duration: 90,
  },
  {
    id: 'sample17',
    title: 'Rain Drops',
    url: 'https://www.soundjay.com/nature/sounds/rain-drops-1.wav',
    duration: 120,
  },
  {
    id: 'sample18',
    title: 'Ocean Waves',
    url: 'https://www.soundjay.com/nature/sounds/ocean-waves-1.wav',
    duration: 150,
  },
  {
    id: 'sample19',
    title: 'Guitar Strum',
    url: 'https://www.soundjay.com/instruments/sounds/guitar-strum-1.wav',
    duration: 45,
  },
  {
    id: 'sample20',
    title: 'Violin Note',
    url: 'https://www.soundjay.com/instruments/sounds/violin-note-1.wav',
    duration: 30,
  },
];

export const getRandomSampleAudio = () => {
  const randomIndex = Math.floor(Math.random() * sampleAudioFiles.length);
  return sampleAudioFiles[randomIndex];
};

// Get sample audio by category
export const getSampleAudioByCategory = (category: string) => {
  const categoryMap: Record<string, string[]> = {
    'nature': ['sample16', 'sample17', 'sample18', 'sample5', 'sample6'],
    'instruments': ['sample7', 'sample19', 'sample20', 'sample10'],
    'electronic': ['sample8', 'sample12', 'sample14', 'sample15'],
    'ambient': ['sample1', 'sample2', 'sample3', 'sample9'],
    'effects': ['sample4', 'sample11', 'sample13'],
  };
  
  const categoryIds = categoryMap[category] || [];
  return sampleAudioFiles.filter(audio => categoryIds.includes(audio.id));
};

// Get high quality sample audio (longer duration)
export const getHighQualitySamples = () => {
  return sampleAudioFiles.filter(audio => audio.duration >= 90);
};