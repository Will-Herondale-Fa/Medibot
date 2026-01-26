import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

function Call() {
    const { room } = useParams();
    const containerRef = useRef();

    useEffect(() => {
        if (room && containerRef.current) {
            // Load Jitsi script if not loaded
            if (!window.JitsiMeetExternalAPI) {
                const script = document.createElement('script');
                script.src = 'https://meet.jit.si/external_api.js';
                script.onload = initJitsi;
                document.head.appendChild(script);
            } else {
                initJitsi();
            }
        }
    }, [room]);

    const initJitsi = () => {
        const domain = 'meet.jit.si';
        const options = {
            roomName: room,
            width: '100%',
            height: 600,
            parentNode: containerRef.current
        };
        new window.JitsiMeetExternalAPI(domain, options);
    };

    return (
        <div className="container">
            <h1>Video Call</h1>
            <div ref={containerRef} style={{ height: '600px' }}></div>
            <button onClick={() => window.history.back()}>Back</button>
        </div>
    );
}

export default Call;