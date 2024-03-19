import React, { useState, useEffect } from "react";
import Kos from "./Kos";
import { KosSkeleton } from "./Kos";
import axios from "axios";
import config from "../config";
import InArray from "../lib/InArray";
import { useDebouncedCallback } from "use-debounce";
import useUser from "../Hooks/useHooks";
import { IconFilter, IconPlus, IconX } from "@tabler/icons-react";
import Popup from "./Popup";
import Currency from "../lib/Currency";

export default function KosContent({ page, totalKos, q }){

    const kosType = {
        nama: "Lake Arrowhead, California, Amerika Serikat",
        rating: 4.8,
        jarak: 8,
        tanggal: [24, 29],
        bulan: "Sep",
        harga: "5.499.620"
    }

    const [firstLoad, setFirstLoad] = useState(true);
    const [raw, setRaw] = useState(null);
    const [pageIndex, setPageIndex] = useState(1);
    const [listings, setListings] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [triggerLoading, setTriggerLoading] = useState(false);
    const [facilities, setFacilities] = useState([]);
    const [featuredFacilities, setFeaturedFacilities] = useState([]);
    const [allFacilities, setAllFacilities] = useState([]);
    const [rawFacilities, setRawFacilities] = useState([]);
    const [localQ, setLocalQ] = useState(q);
    const [wishlists, setWishLists] = useState([]);
    const [user, setUser] = useUser();
    const [showFilter, setShowFilter] = useState(false);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    
    const [city, setCity] = useState(null);
    const [cities, setCities] = useState([]);
    const [isLoadingCity, setLoadingCity] = useState(true);
    const [isLoadingFacilities, setLoadingFacilities] = useState(true);
    const [isLoadingWishlist, setLoadingWishlist] = useState(true);

    useEffect(() => {
        if (isLoadingFacilities) {
            setLoadingFacilities(false);
            axios.get(`${config.baseUrl}/api/facility`)
            .then(response => {
                let res = response.data;
                setAllFacilities(res.facilities);
                let facs = [];
                Object.keys(res.facilities).map((key, k) => {
                    res.facilities[key].map(fac => facs.push(fac))
                });
                setRawFacilities(facs);
            })
        }
    }, [isLoadingFacilities])

    useEffect(() => {
        if (isLoadingCity) {
            setLoadingCity(false);
            axios.get(`${config.baseUrl}/api/city`)
            .then(response => {
                let res = response.data;
                let cits = res.cities;

                setCities(cits);
                cits.map(cit => {
                    if (parseInt(cit.is_default)) {
                        setCity(cit.name.toLowerCase());
                    }
                });

                setLoading(true);
                setTriggerLoading(true);
            })
        }
    }, [isLoadingCity]);

    useEffect(() => {
        if (isLoadingWishlist && user !== null && user !== 'unauthenticated') {
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
    
    useEffect(() => {
        if (isLoading && triggerLoading) {
            setTriggerLoading(false);
            axios.get(`${config.baseUrl}/api/page/home?page=${pageIndex}&q=${localQ}&min_price=${minPrice}&max_price=${maxPrice}&city=${city}&facilities=${btoa(facilities.join(','))}`)
            .then(response => {
                let res = response.data;
                setLoading(false);
                setRaw(res.listings);
                
                if (firstLoad) {
                    setFirstLoad(false);
                    setFeaturedFacilities(res.featured_facilities);
                    setListings(res.listings.data);
                } else {
                    let lists = [...listings];
                    res.listings.data.map(list => lists.push(list));
                    setListings(lists);
                }
            })
        }
    }, [isLoading, triggerLoading, firstLoad])

    useEffect(() => {
        if (localQ !== q) {
            setLocalQ(q);
            debounce();
        }
    }, [localQ, q]);

    const debounce = useDebouncedCallback(() => {
        setLoading(true);
        setTriggerLoading(true);
        setFirstLoad(true);
    }, 1300);

    const removeFacilityFilter = id => {
        let facs = [...facilities];
        facs.splice(facs.indexOf(id), 1);
        setFacilities(facs);
        setLoading(true);
        setTriggerLoading(true);
        setFirstLoad(true);
    }

    return (
        <>
            <div className={`kos-content ${page === 'home' ? "mt-32" : ""}`}>
                <div className="w-[90vw] mb-8 mx-auto flex flex-row gap-4 mobile:flex-col">
                    <div className="flex flex-grow items-center gap-2">
                        <div className="text-xl">Rekomendasi Kos di</div>
                        <select className="text-xl text-primary font-medium cursor-pointer outline-none" value={city} onChange={e => {
                            setCity(e.currentTarget.value);
                            setFirstLoad(true);
                            setLoading(true);
                            setTriggerLoading(true);
                        }}>
                            <option value="">Semua Kota</option>
                            {
                                cities.map((cit, c) => (
                                    <option value={cit.name.toLowerCase()}>{cit.name}</option>
                                ))
                            }
                        </select>
                    </div>
                    {
                        facilities.length > 0 ?
                        <div className="flex flex-col gap-2">
                            <div className="text-base-600 text-xs">Menampilkan kos dengan fasilitas :</div>
                            <div className="flex overflow-x-auto whitespace-no-wrap">
                                {
                                    facilities.map((facility, f) => {
                                        return rawFacilities.map(rf => {
                                            if (facility === rf.id) {
                                                return (
                                                    <div key={f} className={`flex-shrink-0 flex flex-row items-center gap-4 mr-4 min-w-1/4 p-3 ps-4 pe-4 rounded-full cursor-pointer ${InArray(facility.id, facilities) ? 'bg-primary bg-opacity-20' : 'border'}`}>
                                                        <img src={`${config.baseUrl}/storage/facility_icons/${rf.icon}`} alt={rf.name} 
                                                            className="h-5 aspect-square object-cover"
                                                        />
                                                        <div className="text-sm">{rf.name}</div>
                                                        <div className="cursor-pointer rounded-full aspect-square h-5 flex items-center justify-center" style={{backgroundColor: '#e74c3c'}} onClick={() => {
                                                            removeFacilityFilter(facility);
                                                        }}>
                                                            <IconX size={12} color="#fff" fill="1.5" />
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })
                                    })
                                }
                                <div className="flex flex-row gap-4 items-center rounded-full cursor-pointer border p-2 ps-4 pe-4" onClick={() => setShowFilter(true)}>
                                <IconPlus color="#212121" />
                                <div className="text-base-400 text-xs">Add Filter</div>
                            </div>
                            </div>
                        </div>
                        :
                        <div className="flex flex-row gap-4 items-center rounded-full cursor-pointer border p-2 ps-4 pe-4" onClick={() => setShowFilter(true)}>
                            <IconFilter color="#212121" />
                            <div className="text-base-400 text-sm">Filter</div>
                        </div>
                    }
                    
                    {
                        featuredFacilities === "jjj" &&
                        <div>
                            <div className="flex overflow-x-auto whitespace-no-wrap">
                                {
                                    featuredFacilities.map((facility, f) => (
                                        <div key={f} className={`flex-shrink-0 flex flex-row gap-4 mr-4 min-w-1/4 p-3 ps-4 pe-4 rounded-full cursor-pointer ${InArray(facility.id, facilities) ? 'bg-primary bg-opacity-20' : 'border'}`} onClick={() => {
                                            let facs = [...facilities];
                                            if (InArray(facility.id, facs)) {
                                                facs.splice(facs.indexOf(facility.id), 1);
                                            } else {
                                                facs.push(facility.id);
                                            }
                                            setPageIndex(1);
                                            setFacilities(facs);
                                            setFirstLoad(true);
                                            setLoading(true);
                                            setTriggerLoading(true);
                                        }}>
                                            <img src={`${config.baseUrl}/storage/facility_icons/${facility.icon}`} alt={facility.name} 
                                                className="h-5 aspect-square object-cover"
                                            />
                                            <div className="text-sm">{facility.name}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    }
                </div>
                <div className={`w-[90vw] mb-12 mx-auto grid grid-cols-4 gap-6 gap-y-8 mobile:flex mobile:flex-col tablet:grid-cols-2`}>
                {
                    (isLoading && firstLoad) ?
                    [...new Array(totalKos)].map((item, index) => <KosSkeleton key={index} />)
                    :
                    listings.map((item, index) => <Kos kos={item} key={index} wishlistsRaw={wishlists} />)
                }
                </div>
                {
                    raw?.next_page_url !== null &&
                    <div className="w-full flex justify-center my-12" onClick={() => {
                        setPageIndex(pageIndex + 1);
                        setLoading(true);
                        setTriggerLoading(true);
                    }}>
                        <button className="rounded-lg bg-primary py-3 px-6 font-semibold text-white">Tampilkan lebih banyak</button>
                    </div>
                }
            </div>

            {
                showFilter &&
                <Popup onDismiss={() => setShowFilter(false)}>
                    <div className="p-8 mobile:p-4">
                        <div className="flex flex-row gap-4 items-center mb-8">
                            <div className="flex grow text-2xl font-bold">
                                Filter
                            </div>
                            <div className="cursor-pointer" onClick={() => setShowFilter(false)}>
                                <IconX />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            {
                                Object.keys(allFacilities).map((key, k) => (
                                    <div key={k}>
                                        <div className="font-medium">{key}</div>
                                        <div className="flex flex-row gap-1 flex-wrap">
                                        {
                                            allFacilities[key].map((facility, f) => (
                                                <div key={f} className={`flex flex-row mt-2 gap-4 mr-4 min-w-1/4 p-3 ps-4 pe-4 rounded-full cursor-pointer ${InArray(facility.id, facilities) ? 'bg-primary bg-opacity-20' : 'border'}`} onClick={() => {
                                                    let facs = [...facilities];
                                                    if (InArray(facility.id, facs)) {
                                                        facs.splice(facs.indexOf(facility.id), 1);
                                                    } else {
                                                        facs.push(facility.id);
                                                    }
                                                    setPageIndex(1);
                                                    setFacilities(facs);
                                                    setFirstLoad(true);
                                                    setLoading(true);
                                                    setTriggerLoading(true);
                                                }}>
                                                    <img src={`${config.baseUrl}/storage/facility_icons/${facility.icon}`} alt={facility.name} 
                                                        className="h-5 aspect-square object-cover"
                                                    />
                                                    <div className="text-sm">{facility.name}</div>
                                                </div>
                                            ))
                                        }
                                        </div>  
                                    </div>
                                ))
                            }
                            <div className="h-10"></div>

                            <div className="font-medium">Rentang Harga</div>
                            <div className="flex flex-row gap-4 items-center mobile:flex-col mobile:gap-2">
                                <div className="flex flex-col grow border rounded grow p-2 ps-3 pe-3">
                                    <div className="text-sm text-gray-400">Terendah</div>
                                    <input type="text" value={Currency(minPrice).encode()} className="grow outline-none mobile:size-full" onInput={e => {
                                        let val = Currency(e.currentTarget.value).decode();
                                        if (isNaN(val)) {
                                            val = 0;
                                        }
                                        setMinPrice(val);
                                        if (val < maxPrice) {
                                            debounce();
                                        }
                                    }} />
                                </div>
                                <div className="flex flex-col grow border rounded grow p-2 ps-3 pe-3">
                                    <div className="text-sm text-gray-400">Tertinggi</div>
                                    <input type="text" value={Currency(maxPrice).encode()} className="grow outline-none mobile:size-full" onInput={e => {
                                        let val = Currency(e.currentTarget.value).decode();
                                        if (isNaN(val)) {
                                            val = 0;
                                        }
                                        setMaxPrice(val);
                                        if (minPrice < val) {
                                            debounce();
                                        }
                                    }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Popup>
            }
        </>
    )
}