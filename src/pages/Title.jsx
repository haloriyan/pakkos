import { IconUser, IconX } from "@tabler/icons-react"
import Navbar from "../components/Navbar"
import { 
    IconBolt, IconPackage, IconHeart, IconMapPin, IconShare2,
    IconGridDots, IconChevronLeft, IconDroplet, IconBookmark, IconCheck
} from "@tabler/icons-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import goTop from "../components/goTop"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import config from "../config"
import Currency from "../lib/Currency"
import useUser from "../Hooks/useHooks"
import InArray from "../lib/InArray"
import { useGoogleLogin } from "@react-oauth/google"
import ReactImageGallery from "react-image-gallery"
import "react-image-gallery/styles/css/image-gallery.css"
import Popup from "../components/Popup"
import useLoggingIn from "../Hooks/useLoggingIn";
import ReactGA from "react-ga4";
import bookmarkIcon from "../assets/bookmark.svg";
import checkIcon from "../assets/check.svg";

export default function Title(){
    const { slug } = useParams();
    const location = useLocation();
    const [isLoading, setLoading] = useState(true);
    const [triggerLoading, setTriggerLoading] = useState(true);
    const [listing, setListing] = useState(null);
    const [user, setUser] = useUser();
    const [pageTitle, setPageTitle] = useState('Pakkos');

    const [isGalleryShowing, setGalleryShowing] = useState(false);
    const [galleryImages, setGalleryImages] = useState([]);

    useEffect(() => {
        document.title = pageTitle;
        
        ReactGA.send({
            hitType: "pageview",
            page: location.pathname + location.search,
            title: pageTitle,
        })
    }, [pageTitle, location]);

    useEffect(() => {
        if (isLoading && triggerLoading) {
            setTriggerLoading(false);
            axios.get(`${config.baseUrl}/api/listing/${slug}`)
            .then(response => {
                let res = response.data;
                let listing = res.listing;
                setLoading(false);
                setListing(listing);
                setPageTitle(`${listing.name} - Pakkos`);

                let imgs = [
                    {
                        original: `${config.baseUrl}/storage/listing_photos/${listing.front_room_photo}`,
                        thumbnail: `${config.baseUrl}/storage/listing_photos/${listing.front_room_photo}`,
                        description: "Foto depan kamar",
                    },
                    {
                        original: `${config.baseUrl}/storage/listing_photos/${listing.inside_room_photo}`,
                        thumbnail: `${config.baseUrl}/storage/listing_photos/${listing.inside_room_photo}`,
                        description: "Foto dalam kamar",
                    },
                    {
                        original: `${config.baseUrl}/storage/listing_photos/${listing.front_building_photo}`,
                        thumbnail: `${config.baseUrl}/storage/listing_photos/${listing.front_building_photo}`,
                        description: "Foto bangunan tampak depan",
                    },
                    {
                        original: `${config.baseUrl}/storage/listing_photos/${listing.inside_building_photo}`,
                        thumbnail: `${config.baseUrl}/storage/listing_photos/${listing.inside_building_photo}`,
                        description: "Foto bangunan tampak dalam",
                    },
                    {
                        original: `${config.baseUrl}/storage/listing_photos/${listing.streetview_building_photo}`,
                        thumbnail: `${config.baseUrl}/storage/listing_photos/${listing.streetview_building_photo}`,
                        description: "Foto bangunan tampak dalam",
                    },
                    {
                        original: `${config.baseUrl}/storage/listing_photos/${listing.bath_room_photo}`,
                        thumbnail: `${config.baseUrl}/storage/listing_photos/${listing.bath_room_photo}`,
                        description: "Foto kamar mandi",
                    }
                ];
                if (listing.other_photo !== null) {
                    imgs.push({
                        original: `${config.baseUrl}/storage/listing_photos/${listing.other_photo}`,
                        thumbnail: `${config.baseUrl}/storage/listing_photos/${listing.other_photo}`,
                        description: "Foto lainnya",
                    });
                }
                setGalleryImages(imgs);
            })
        }
    }, [isLoading, triggerLoading]);

    return (
        <>
        <Navbar page={"title"} />
        {
            listing !== null &&
            <>
            <Header kos={listing} galleryImages={galleryImages} galleryStates={[isGalleryShowing, setGalleryShowing]} user={user} />
            <Content kos={listing} />
            </>
        }
        </>
    )
}

function Header({kos, galleryImages, galleryStates, user}){
    const [wishlists, setWishLists] = useState([]);
    const [isLoadingWishlist, setLoadingWishlist] = useState(true);

    const mobileDevice = window.matchMedia("screen and (max-width: 480px)").matches

    const [isSharing, setSharing] = useState(false);
    const [shareBtn, setShareBtn] = useState('Salin');

    useEffect(() => {
        if (shareBtn !== "Salin") {
            let to = setTimeout(() => {
                setShareBtn('Salin');
            }, 3000);

            return () => clearTimeout(to);
        }
    }, [shareBtn]);

    useEffect(() => {
        if (isLoadingWishlist && user !== null && user !== 'unauthenticated' && user !== undefined) {
            setLoadingWishlist(false);
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
            })
        }
    }, [isLoadingWishlist, user])

    const wishlist = () => {
        axios.post(`${config.baseUrl}/api/user/wishlist/put`, {
            listing_id: kos.id,
            user_id: user.id,
        })
        .then(response => {
            setLoadingWishlist(true);
        })
    }
    
    const [loggingIn] = useLoggingIn();

    return (
        <header className="w-[80vw] mx-auto mt-32 flex flex-col gap-4 mobile:w-full mobile:flex-col-reverse tablet:w-[90vw] mobile:mt-0">
            <div className="info flex flex-col gap-4 mobile:px-[5vw]">
                <div className="font-semibold text-2xl">{kos?.name}</div>
                <div className="flex items-center justify-between text-sm mobile:flex-col mobile:items-start mobile:gap-4">
                    <div className="left flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <IconUser stroke={1.5} className="text-primary" />
                            <span>{kos?.consumer_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <IconMapPin stroke={1.5} className="text-primary" />
                            <span>{kos.subdistrict}, {kos.city}</span>
                        </div>
                    </div>
                    {
                        window.screen.width > 480 &&
                        <div className="right flex items-center gap-4">
                            <div className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-black/[.05]" onClick={() => setSharing(true)}>
                                <IconShare2 stroke={1.5} className="text-primary" />
                                <span>Bagikan</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-black/[.05]" onClick={() => {
                                if (user !== null && user !== 'unauthenticated') {
                                    wishlist();
                                } else {
                                    loggingIn()
                                }
                            }}>
                                <IconHeart stroke={1.5} className="text-primary" fill={
                                    InArray(kos.id, wishlists) ? '#0870cd' : 'transparent'
                                } />
                                <span>Simpan</span>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className="images flex w-full mobile:overflow-x-auto relative">
            {
                !mobileDevice &&
                <div className="images-container w-full h-[420px] flex rounded-md overflow-hidden mobile:w-full mobile:h-[100vw] mobile:overflow-x-auto mobile:rounded-none">
                    <div className="images w-full h-full grid grid-rows-2 grid-cols-4 gap-2 mobile:w-fit mobile:flex mobile:gap-0">
                        <div className="row-span-2 col-span-2 mobile:w-[100vw] mobile:h-[100vw]" style={{
                            backgroundImage: `url('${config.baseUrl}/storage/listing_photos/${kos.front_building_photo}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center center'
                        }}></div>
                        <div className="mobile:w-[100vw] mobile:h-[100vw]" style={{
                            backgroundImage: `url('${config.baseUrl}/storage/listing_photos/${kos.inside_building_photo}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center center'
                        }}></div>
                        <div className="mobile:w-[100vw] mobile:h-[100vw]" style={{
                            backgroundImage: `url('${config.baseUrl}/storage/listing_photos/${kos.front_room_photo}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center center'
                        }}></div>
                        <div className="mobile:w-[100vw] mobile:h-[100vw]" style={{
                            backgroundImage: `url('${config.baseUrl}/storage/listing_photos/${kos.inside_room_photo}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center center'
                        }}></div>
                        <div className="mobile:w-[100vw] mobile:h-[100vw]" style={{
                            backgroundImage: `url('${config.baseUrl}/storage/listing_photos/${kos.streetview_building_photo}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center center'
                        }}></div>
                    </div>
                </div>
            }
            {
                mobileDevice &&
                <Swiper spaceBetween={0} slidesPerView={1} onSlideChange={() => console.log('slide change')} onSwiper={(swiper) => console.log(swiper)} >
                    <SwiperSlide>
                        <div className="mobile:w-[100vw] mobile:h-[70vw]" style={{
                            backgroundImage: `url('${config.baseUrl}/storage/listing_photos/${kos.front_room_photo}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center center'
                        }}></div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="mobile:w-[100vw] mobile:h-[70vw]" style={{
                            backgroundImage: `url('${config.baseUrl}/storage/listing_photos/${kos.inside_room_photo}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center center'
                        }}></div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="mobile:w-[100vw] mobile:h-[70vw]" style={{
                            backgroundImage: `url('${config.baseUrl}/storage/listing_photos/${kos.front_building_photo}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center center'
                        }}></div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="mobile:w-[100vw] mobile:h-[70vw]" style={{
                            backgroundImage: `url('${config.baseUrl}/storage/listing_photos/${kos.streetview_building_photo}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center center'
                        }}></div>
                    </SwiperSlide>
                </Swiper>
            }
                <div className="btns hidden mobile:flex mobile:justify-between mobile:absolute mobile:top-0 mobile:left-0 mobile:right-0 mobile:p-4 mobile:z-10">
                    <Link to={"/room"} onClick={goTop} className="back flex justify-center items-center rounded-full bg-white p-2">
                        <IconChevronLeft width={20} height={20} />
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex justify-center items-center rounded-full bg-white p-2" onClick={() => setSharing(true)}>
                            <IconShare2 width={20} height={20} />
                        </div>
                        {/* <div className="flex justify-center items-center rounded-full bg-white p-2">
                            <IconHeart width={20} height={20} />
                        </div> */}
                    </div>
                </div>
                <button className="absolute bottom-4 right-4 flex items-center text-sm gap-2 py-1 px-4 border border-black rounded-lg bg-white mobile:hidden" onClick={() => {
                    galleryStates[1](!galleryStates[0]);
                }}>
                    <IconGridDots stroke={1.5} />
                    <span>Tampilkan semua foto</span>
                </button>
            </div>

            {
                galleryStates[0] &&
                <Popup onDismiss={() => galleryStates[1](false)}>
                    <ReactImageGallery items={galleryImages} showIndex showBullets showPlayButton={false} showThumbnails={true} />
                </Popup>
            }

            {
                isSharing &&
                <Popup onDismiss={() => setSharing(false)}>
                    <div className="flex flex-row gap-4 items-center">
                        <div className="text-xl text-base-600 flex grow">
                            Bagikan ke temanmu yang lagi butuh kos!
                        </div>
                        <IconX className="cursor-pointer" onClick={() => setSharing(false)} />
                    </div>

                    <div className="bg-gray-100 rounded-lg p-4 mt-6 flex flex-row gap-4 items-center mobile:flex-col">
                        <img src={`${config.baseUrl}/storage/listing_photos/${kos.front_room_photo}`} alt={kos.name} className="aspect-square rounded-md object-cover h-16" />
                        <div className="flex flex-col grow gap-1">
                            <div className="text-lg">{kos.name}</div>
                            <div className="text-sm text-base-400">pakkos.com/{kos.slug}</div>
                        </div>
                        <button className="bg-primary rounded-md text-zinc-50 p-2 ps-5 pe-5" onClick={() => {
                            navigator.clipboard.writeText(`https://pakkos.com/${kos.slug}`);
                            setShareBtn('Disalin!');
                        }}>{shareBtn}</button>
                    </div>
                </Popup>
            }
        </header>
    )
}

function Content({kos}){
    return (
        <div className="flex gap-20 w-[80vw] mx-auto mt-10 mb-24 mobile:w-[90vw] mobile:flex-col-reverse tablet:w-[90vw]">
            <Keuntungan kos={kos} />
            <Harga kos={kos} />
        </div>
    )
}

function Keuntungan({kos}){
    return (
        <section className="w-[65%] flex flex-col gap-8 mobile:w-full">
            <Deskripsi kos={kos} />
            <div className="line h-[1px] w-full bg-[#ddd]"></div>
            <YangKamuDapatkan />
            <div className="line h-[1px] w-full bg-[#ddd]"></div>
            <SpesifikasiKamar kos={kos} />
            <Facilities facilities={kos.facilities_display} />
        </section>
    )
}

const Facilities = ({facilities}) => {
    return Object.keys(facilities).map((key, k) => (
        <div key={k}>
            <div className="line h-[1px] w-full bg-[#ddd]"></div>
            <div className="w-full flex flex-col gap-4">
                <div className="title text-xl font-semibold mt-6 mb-2">{key}</div>
                <div className="items grid grid-cols-2 gap-4 mobile:grid-cols-1 tablet:grid-cols-1">
                {
                    facilities[key].map((fac, f) => (
                        <div className="item flex items-center gap-4" key={f}>
                            <img src={`${config.baseUrl}/storage/facility_icons/${fac.facility.icon}`} alt={fac.facility.name} className="aspect-square h-5" />
                            <span>{fac.facility.name}</span>
                        </div>
                    ))
                }
                </div>
            </div>
        </div>
    ))
}

const Deskripsi = ({kos}) => {
    return (
        <div className="w-full flex flex-col gap-4">
            <div className="title text-xl font-semibold">Deskripsi</div>
            <pre style={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'Roboto',
                fontSize: 16,
                fontWeight: '400'
            }}>{kos.description}</pre>
        </div>
    )
}

function YangKamuDapatkan(){

    const data = [
        {
            title: "Harga Transparan",
            text: "Biaya yang tercantum di halaman ini merupakan harga asli yang ditawarkan oleh pemilik tanpa ada penambahan biaya dari Pakkos.",
            // icon: <IconBookmark stroke={1.5} width={32} height={32} />,
            icon: <img src={bookmarkIcon} alt="bookmark" style={{
                width: 32,height: 32,
            }} />
        },
        {
            title: "Sudah Terverifikasi",
            text: "Tempat ini sudah kami kunjungi langsung sehingga bisa dipastikan keaslian lokasi kos, kondisi kamar dan juga fasilitas yang disediakan oleh pemilik.",
            // icon: <IconCheck stroke={1.5} width={32} height={32} />
            icon: <img src={checkIcon} alt="check" style={{
                width: 32,height: 32,
            }} />
        }
    ]

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="title text-xl font-semibold">Yang kamu dapatkan</div>
            <div className="items flex flex-col gap-4">
            {
                data.map((item, index) => {
                    return (
                        <div className="item flex gap-6" key={index}>
                            <div className="img flex mobile:w-3/12">
                                {item.icon}
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="font-semibold">{item.title}</div>
                                <div className="text-sm text-[#717171]">{item.text}</div>
                            </div>
                        </div>
                    )
                })
            }
            </div>
        </div>
    )
}

function SpesifikasiKamar({kos}){

    const data = [
        {
            title: `${kos.room_size} meter`,
            svg: <IconPackage stroke={1.5} width={32} height={32} />
        },
        {
            title: InArray('listrik', kos.price_inclusion.toLowerCase().split(',')) ? <span>Termasuk Listrik</span> : null,
            svg: InArray('listrik', kos.price_inclusion.toLowerCase().split(',')) ? <IconBolt stroke={1.5} width={32} height={32} /> : null
        },
        {
            title: InArray('air pdam', kos.price_inclusion.toLowerCase().split(',')) ? <span>Termasuk Air PDAM</span> : null,
            svg: InArray('air pdam', kos.price_inclusion.toLowerCase().split(',')) ? <IconDroplet stroke={1.5} width={32} height={32} /> : null
        }
    ]

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="title text-xl font-semibold">Spesifikasi tipe kamar</div>
            <div className="items flex flex-col gap-4">
            {
                data.map((item, index) => {
                    if (item.title !== null) return (
                        <div className="item flex items-center gap-4" key={index}>
                            {item.svg}
                            {item.title}
                        </div>
                    )
                })
            }
            </div>
        </div>
    )
}

function Harga({kos}){

    const [showTanyaPemilik, setShowTanyaPemilik] = useState(false)
    const [user, setUser] = useUser();
    const navigate = useNavigate();

    const [loggingIn] = useLoggingIn();

    return (
        <>
        {
            window.screen.width > 480 ?
                <>
                    <section className="w-[35%] h-fit flex flex-col gap-4 p-6 border rounded-xl bg-white shadow-xl sticky top-24 mobile:w-full mobile:fixed mobile:bottom-0 mobile:top-auto mobile:left-0 mobile:right-0 mobile:flex-row mobile:rounded-none mobile:items-center mobile:border-t">
                        <div className="mobile:whitespace-nowrap">
                            <span className="font-semibold text-xl">{Currency(kos.price).encode()}</span> / bulan
                        </div>

                        <div className="flex flex-col gap-2">
                            {
                                InArray('listrik', kos.price_inclusion.toLowerCase().split(',')) &&
                                <div className="flex flex-row gap-2">
                                    <IconBolt />
                                    <div>Termasuk Listrik</div>
                                </div>
                            }
                            {
                                InArray('air pdam', kos.price_inclusion.toLowerCase().split(',')) &&
                                <div className="flex flex-row gap-2">
                                    <IconDroplet />
                                    <div>Termasuk Air PDAM</div>
                                </div>
                            }
                        </div>
                        
                        <button className="rounded-lg w-full flex items-center justify-center text-white py-2 font-semibold bg-primary" onClick={() => {
                            if (user === null || user === 'unauthenticated') {
                                loggingIn();
                            } else {
                                setShowTanyaPemilik(true);
                            }
                        }}>Tanya Pakkos</button>
                    </section>
                </>
            :
                <section className="w-[35%] h-fit flex flex-col gap-4 p-6 border rounded-xl bg-white shadow-xl sticky top-24 mobile:w-full mobile:fixed mobile:bottom-0 mobile:top-auto mobile:left-0 mobile:right-0 mobile:flex-row mobile:rounded-none mobile:items-center mobile:border-t">
                    <div className="flex grow flex-row justify-center content-center items-center gap-4">
                        <div className="flex-col grow text-slate-600">
                            <div className="mb-2">{Currency(kos.price).encode()}</div>
                            {
                                InArray('listrik', kos.price_inclusion.toLowerCase().split(',')) &&
                                <div className="flex flex-row items-center gap-2">
                                    <IconBolt size={12} />
                                    <div className="text-xs">Termasuk Listrik</div>
                                </div>
                            }
                            {
                                InArray('air pdam', kos.price_inclusion.toLowerCase().split(',')) &&
                                <div className="flex flex-row items-center gap-2">
                                    <IconBolt size={12} />
                                    <div className="text-xs">Termasuk Air PDAM</div>
                                </div>
                            }
                        </div>
                        
                        <button className="rounded-lg flex items-center justify-center text-white p-2 ps-4 pe-4 font-semibold bg-primary" onClick={() => {
                            if (user === null || user === 'unauthenticated') {
                                loggingIn();
                            } else {
                                setShowTanyaPemilik(true);
                            }
                        }}>Tanya Pakkos</button>
                    </div>
                </section>
        }
        <TanyaPemilik showTanyaPemilik={showTanyaPemilik} setShowTanyaPemilik={setShowTanyaPemilik} kos={kos}  />
        </>
    )
}

function TanyaPemilik({ showTanyaPemilik, setShowTanyaPemilik, kos }){

    const [templates, setTemplates] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [record, setRecord] = useState({});
    const [recordKeys, setRecordKeys] = useState([]);
    const [user, setUser] = useUser();

    useEffect(() => {
        if (isLoading) {
            setLoading(false);
            axios.get(`${config.baseUrl}/api/template`)
            .then(response => {
                let res = response.data;
                let temps = res.templates;
                let rec = {...record};
                let theKeys = [];

                Object.keys(temps).map(key => {
                    rec[key] = '';
                    theKeys.push(key);
                })

                setRecord(rec);
                setRecordKeys(theKeys);
                setTemplates(res.templates);
            })
        }
    }, [isLoading]);

    const submitPertanyaan = () => {
        let message = `Halo, Pakkos. Saya ${user.name} (${record[config.activity_key]}) ingin bertanya mengenai kos ${kos.name} yang di ${kos.subdistrict}, ${kos.city}, ${record[config.question_key]} \n\n https://pakkos.com/${kos.slug}`;
        let waUri = `https://wa.me/${config.whatsapp_admin}?text=${encodeURIComponent(message)}`;
        
        axios.post(`${config.baseUrl}/api/reservation/submit`, {
                record,
            user_id: user.id,
            listing_id: kos.id,
        })
        .then(response => {
            let res = response.data;
            window.open(waUri);
            let rec = {...record};
            Object.keys(templates).map(key => {
                rec[key] = '';
            })
            setRecord(rec);
            setShowTanyaPemilik(false);
        })
    }

    return (
        <>
        <div className={`overlay ${showTanyaPemilik ? "flex" : "hidden"} bg-black/[.5] fixed top-0 left-0 right-0 bottom-0 z-20`} onClick={() => setShowTanyaPemilik(false)}></div>
        <div className={`${showTanyaPemilik ? "flex" : "hidden"} fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-xl bg-white p-12 z-30 mobile:w-[90vw] mobile:p-8`}>
            {
                Object.keys(templates).map((key, k) => (
                    <div className="flex flex-col gap-4" key={k}>
                        <div className="font-semibold text-xl">{key}</div>
                        <div className="flex flex-col gap-4">
                            {
                                templates[key].map((temp, t) => (
                                    <div className="flex items-center gap-4 cursor-pointer" key={t} onClick={() => {
                                        let rec = {...record};
                                        rec[key] = temp.body;
                                        setRecord(rec);
                                    }}>
                                        <div className="circle flex justify-center items-center p-[2px] rounded-full border border-primary">
                                            <div className={`circle-point rounded-full w-4 h-4 ${record[key] === temp.body ? "bg-primary" : ""}`}></div>
                                        </div>
                                        <span>{temp.body}</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                ))
            }
            
            <button className={`bg-primary text-white rounded-lg flex justify-center w-full py-2 font-semibold ${(record[recordKeys[0]] === "" || record[recordKeys[1]] === "") ? 'opacity-30' : ''}`} onClick={() => {
                if (record[recordKeys[0]] !== "" && record[recordKeys[1]] !== "") {
                    submitPertanyaan();
                }
            }}>Kirim</button>
        </div>
        </>
    )
}