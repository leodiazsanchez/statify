import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientId, getAccessToken } from '../scripts/authCodeWithPkce';

function Callback({signIn}) {
    const navigate = useNavigate();
    useEffect(() => {
        const fetchAccessToken = async () => {
            const params = new URLSearchParams(window.location.search);
            const code = params.get("code");
            const accessToken = await getAccessToken(clientId, code);
            localStorage.setItem("accessToken", accessToken);

            signIn(accessToken);
            navigate("/");
        };

        fetchAccessToken();
    }, []);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}

export default Callback;
