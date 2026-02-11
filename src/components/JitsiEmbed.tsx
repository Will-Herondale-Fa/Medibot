export default function JitsiEmbed({ room }: { room: string }) {
  const src = `https://meet.jit.si/${room}#config.startWithVideoMuted=true&config.startWithAudioMuted=true&config.disableDeepLinking=true`;
  return (
    <div className="jitsi-container">
      <iframe src={src} className="jitsi-frame" allow="camera; microphone; fullscreen; display-capture" />
    </div>
  );
}
