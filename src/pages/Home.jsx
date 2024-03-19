import { Link, useLocation, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import KosContent from "../components/KosContent";
import Navbar from "../components/Navbar";
import Penjelasan from "../components/Penjelasan";
import goTop from "../components/goTop"
import { useEffect, useState } from "react";
import ReactGA from "react-ga4";

export default function Home(){
    const [searchParams, setSearchParams] = useSearchParams();
    const [q, setQ] = useState(searchParams.get('q'));
    const location = useLocation();

    const [pageTitle, setPageTitle] = useState('Home - Pakkos');

    useEffect(() => {
        document.title = pageTitle;
        ReactGA.send({
            hitType: "pageview",
            page: location.pathname + location.search,
            title: pageTitle,
        })
    }, [pageTitle, location])

    return (
        <>
        <Navbar page={'home'} setQ={setQ} />
        <KosContent page={"home"} totalKos={16} q={q} />
        
        {/* <Penjelasan /> */}
        {/* <Footer /> */}
        </>
    )
}