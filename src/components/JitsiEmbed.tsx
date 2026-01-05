export default function JitsiEmbed({ room }: { room: string }) {
  const src = `https://meet.jit.si/${room}#config.startWithVideoMuted=true&config.startWithAudioMuted=true&config.disableDeepLinking=true`;
  return (
    <div style={{ height: '70vh', width: '100%' }}>
      <iframe src={src} style={{ width: '100%', height: '100%', border: 0 }} allow="camera; microphone; fullscreen; display-capture" />
    </div>
  );
}
