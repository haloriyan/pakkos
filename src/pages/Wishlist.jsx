import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import useUser from "../Hooks/useHooks";
import config from "../config";
import Kos from "../components/Kos";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReactGA from "react-ga4";

const Wishlist = () => {
    const location = useLocation();
    const [isLoading, setLoading] = useState(true);
    const [listings, setListings] = useState([]);
    const [user, setUser] = useUser();
    const [wishlists, setWishLists] = useState([]);
    const navigate = useNavigate();
    const [pageTitle, setPageTitle] = useState('Wishlist - Pakkos');

    useEffect(() => {
        ReactGA.send({
            hitType: "pageview",
            page: location.pathname + location.search,
            title: pageTitle,
        })
    }, [pageTitle, location]);

    useEffect(() => {
        if (isLoading && user !== null && user !== 'unauthenticated') {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/user/wishlist`, {
                user_id: user.id
            })
            .then(response => {
                let res = response.data;
                let w = [];
                res.wishlists.map(item => {
                    w.push(item.listing.id);
                })
                setWishLists(w);
                setListings(res.wishlists);
            })
        }
    }, [isLoading, user]);

    return (
        <>
            <Navbar />
            <div className="kos-content mt-20 p-10 mobile:p-5">
                <div className="text-xl mb-4 flex flex-row gap-4">
                    <div onClick={() => navigate(-1)} className="cursor-pointer">
                        <IconArrowLeft />
                    </div>
                    Kos Favorit Saya
                </div>

                <div className={`w-[90vw] mb-12 mt-8 mx-auto grid grid-cols-4 gap-4 gap-y-8 mobile:flex mobile:flex-col tablet:grid-cols-2`}>
                    {
                        listings.map((listing, l) => {
                            let kos = listing.listing;
                            return <Kos kos={kos} wishlistsRaw={wishlists} triggerLoading={() => {
                                setLoading(true)
                            }} />
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default Wishlist