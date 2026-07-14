export default function SpeechRecorder({ setText }) {
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.start();

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      setText(transcript);
    };
  };

  return (
    <button onClick={startListening}>
      🎤 Speak
    </button>
  );
}