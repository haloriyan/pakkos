import logo from "../assets/logo.svg"
import account_menu from "../assets/account_menu.png"
import account_image from "../assets/account_image.png"
import { useState, useEffect, useRef } from "react"
import { IconHeart, IconSearch } from "@tabler/icons-react"
import { useGoogleLogin } from "@react-oauth/google"
import useUser from "../Hooks/useHooks"
import axios from "axios";
import config from "../config"
import { Link, useNavigate } from "react-router-dom"

export default function Navbar({ page, setQ }){
    const navigate = useNavigate();

    const [showAccountMenu, setShowAccountMenu] = useState(false)
    const showAccountMenuBtn = useRef(null)

    const [user, setUser] = useUser();

    useEffect(() => {
        document.addEventListener("click", function(e){
            if (!showAccountMenuBtn.current?.contains(e.target)){
                setShowAccountMenu(false)
            }
        })
    }, [])

    const loggingOut = (e) => {
        e.preventDefault();
        window.localStorage.removeItem('user_data');
        window.localStorage.removeItem('gat');
        navigate(0);
    }
    
    // GOOGLE AUTHENTICATION START
    const authToAPI = (name, email, photo, password, expiry) => {
        console.log('authenticating to api...');
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
            console.log(res);
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
    const getProfile = (token, expiry) => {
        console.log('getting profile...', token);
        axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                "Authorization": "Bearer " + token,
            }
        })
        .then(res => {
            res = res.data;
            console.log(res);
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

    return (
        <nav className={`fixed left-0 right-0 top-0 py-4 ${page === "title" ? "px-[10vw] tablet:px-[5vw] mobile:hidden" : "px-[5vw]"} bg-white flex items-center justify-between text-[#222] shadow z-10`}>
            <Link to="/" className="logo flex mobile:hidden">
                <img src={logo} alt="Logo" />
            </Link>
            <label className="search w-[40%] flex items-center rounded-full p-2 pl-8 border shadow-md mobile:w-full" onClick={() => {
                if (page !== 'home') {
                    navigate('/')
                }
            }}>
                <input type="text" placeholder="Nama kost atau lokasi" className="w-full outline-none text-sm font-semibold placeholder-gray-400" onInput={e => {
                    let val = e.currentTarget.value;
                    setQ(val);
                }} />
                <div className="search-icon flex p-2 bg-primary rounded-full text-white">
                    <IconSearch stroke={3} width={16} height={16} />
                </div>
            </label>
            <Link to={'/wishlist'} className="ml-4">
                <IconHeart />
            </Link>
            <div className="extra flex items-center gap-4 mobile:hidden">
                <div className="cursor-pointer" onClick={() => window.open('https://help.pakkos.com', '_blank')}>Pusat Bantuan</div>
                <div className="account relative flex">
                    <div className="header flex gap-2 items-center rounded-full p-2 pe-4 ps-4 border cursor-pointer" onClick={() => setShowAccountMenu(!showAccountMenu)} ref={showAccountMenuBtn}>
                        <img src={account_menu} alt="Menu" />
                        <img src={`${user === null || user === 'unauthenticated' ? account_image : user.photo}`} alt="Account" style={{height: 20,borderRadius: 99}} />
                    </div>
                    {
                        (user === null || user === 'unauthenticated') ?
                        <div className={`menu absolute ${showAccountMenu ? "flex" : "hidden"} flex-col gap-2 py-2 bg-white shadow-[0_0_20px_-2px_rgb(0,0,0,.2)] rounded-md top-[120%] right-0`}>
                            <div className="top flex flex-col">
                                <div className="hover:bg-black/[.05] cursor-pointer py-2 px-4" onClick={loggingIn}>Daftar</div>
                                <div className="hover:bg-black/[.05] cursor-pointer py-2 px-4" onClick={loggingIn}>Masuk</div>
                            </div>
                            <div className="line w-full h-[1px] bg-black/[.2]"></div>
                            <div className="bottom flex flex-col">
                                <div className="hover:bg-black/[.05] cursor-pointer py-2 px-4 whitespace-nowrap" onClick={() => window.open('https://help.pakkos.com', '_blank')}>Pusat Bantuan</div>
                            </div>
                        </div>
                        :
                        <div className={`menu absolute ${showAccountMenu ? "flex" : "hidden"} flex-col gap-2 py-2 bg-white shadow-[0_0_20px_-2px_rgb(0,0,0,.2)] rounded-md top-[120%] right-0`}>
                            <div className="top flex flex-col">
                                <div className="hover:bg-black/[.05] cursor-pointer py-2 px-4" onClick={loggingOut}>Logout</div>
                            </div>
                            <div className="line w-full h-[1px] bg-black/[.2]"></div>
                            <div className="bottom flex flex-col">
                                <div className="hover:bg-black/[.05] cursor-pointer py-2 px-4 whitespace-nowrap" onClick={() => window.open('https://help.pakkos.com', '_blank')}>Pusat Bantuan</div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </nav>
    )
}