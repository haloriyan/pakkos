import axios from "axios";
import React, { useEffect, useState } from "react";
import config from "../config";

const useUser = (withApiAuthentication = false, callback = null) => {
    const u = window.localStorage.getItem('user_data');
    const initial = u !== null ? JSON.parse(u) : 'unauthenticated';

    const [user, setValue] = useState(initial);
    const [isAuthing, setAuthing] = useState(true);

    useEffect(() => {
        if (withApiAuthentication && isAuthing && user !== 'unauthenticated') {
            setAuthing(false);
            axios.post(`${config.baseUrl}/api/user/auth`, {
                user_id: user?.id,
            })
            .then(response => {
                let res = response.data;
                if (res.user === null) {
                    setUser('unauthenticated');
                } else {
                    setUser(res.user);
                    if (callback !== null) {
                        callback();
                    }
                }
            })
        }
    }, [withApiAuthentication, isAuthing]);


    const setUser = newValue => {
        setValue(newValue);
        window.localStorage.setItem('user_data', JSON.stringify(newValue));
    }

    return [user, setUser];
}

export default useUser;