import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import config from "../config";
import { useNavigate } from "react-router-dom";

const useLoggingIn = () => {
    const navigate = useNavigate();
    // GOOGLE AUTHENTICATION START
    const authToAPI = (name, email, photo, password, expiry) => {
        axios.post(`${config.baseUrl}/api/user/login`, {
            name: name,
            email: email,
            photo: photo,
            at: password,
        }, {
            method: "POST"
        })
        .then(response => {
            let res = response.data;
            if (response.status === 200) {
                window.localStorage.setItem('gat', JSON.stringify({
                    token: password,
                    expiry,
                }))
                window.localStorage.setItem('user_data', JSON.stringify(res.user));
                navigate(0);
            }
        })
    }
    const getProfile = async (token, expiry) => {
        axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                "Authorization": "Bearer " + token,
            }
        })
        .then(res => {
            res = res.data;
            authToAPI(res.name, res.email, res.picture, token, expiry);
        })
        .catch(e => console.error(e))
    }
    const loggingIn = useGoogleLogin({
        onSuccess: response => {
            getProfile(response.access_token, response.expires_in);
        },
        flow: 'implicit'
    });
    // GOOGLE AUTHENTICATION END

    return [loggingIn];
}

export default useLoggingIn