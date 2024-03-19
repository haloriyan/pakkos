import { IconMap, IconStar } from "@tabler/icons-react"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import { IconHeart } from "@tabler/icons-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import goTop from "../components/goTop"
import { useEffect } from "react"
import { IconUser } from "@tabler/icons-react"
import config from "../config"
import Currency from "../lib/Currency"
import useUser from "../Hooks/useHooks"
import axios from "axios"
import InArray from "../lib/InArray"
import useLoggingIn from "../Hooks/useLoggingIn"

export default function Kos({ kos, wishlistsRaw, triggerLoading = null }){
    // nama, rating, jarak, tanggal, bulan, harga
    const [imgShow, setImgSHow] = useState(0)
    const [isLove, setIsLove] = useState(
        InArray(kos.id, wishlistsRaw)
    )
    const [user, setUser] = useUser();

    const wishlist = () => {
        axios.post(`${config.baseUrl}/api/user/wishlist/put`, {
            listing_id: kos.id,
            user_id: user.id,
        })
        .then(response => {
            if (triggerLoading !== null) {
                triggerLoading()
            }
        })
    }

    const [loggingIn] = useLoggingIn();

    return (
        <Link to={`/room/${kos.slug}`} className={`kos flex flex-col gap-2 text-[#222] cursor-pointer group`}>
            <div className="top flex relative rounded-xl overflow-hidden mobile:h-[90vw] tablet:h-[calc(45vw-.5rem)]">
                <div className={`imgs flex h-full transition duration-200 ${imgShow > 0 ? `img-show-${imgShow}` : ""}`}>
                    <img src={`${config.baseUrl}/storage/listing_photos/${kos.front_room_photo}`} alt="Image" className="aspect-square object-cover" />
                    <img src={`${config.baseUrl}/storage/listing_photos/${kos.front_building_photo}`} alt="Image" className="aspect-square object-cover" />
                    <img src={`${config.baseUrl}/storage/listing_photos/${kos.inside_building_photo}`} alt="Image" className="aspect-square object-cover" />
                </div>
                {
                    (user !== null && user !== 'unauthenticated') &&
                    <div className="love text-white absolute top-4 right-4" onClick={(e) => {
                        wishlist()
                        e.preventDefault()
                        setIsLove(!isLove)
                    }}>
                        <IconHeart stroke={1.5} width={28} height={28} fill={`${isLove ? "#fff" : "transparent"}`} />
                    </div>
                }
                <div className="love text-white absolute top-4 right-4" onClick={(e) => {
                    if (user !== null && user !== 'unauthenticated') {
                        wishlist();
                        setIsLove(!isLove);
                    } else {
                        loggingIn();
                    }
                    e.preventDefault()
                }}>
                    <IconHeart stroke={1.5} width={28} height={28} fill={`${isLove ? "#fff" : "transparent"}`} />
                </div>
                <div className={`btns absolute px-3 top-1/2 -translate-y-1/2 left-0 right-0 flex items-center ${imgShow > 0 ? "justify-between" : "justify-end"} invisible group-hover:visible`}>
                    <div className={`btn left p-1 bg-white/[.8] backdrop-blur-sm rounded-full ${imgShow > 0 ? "flex" : "hidden"} items-center justify-center hover:bg-white`} onClick={(e) => {
                        e.preventDefault()
                        imgShow > 0 ? setImgSHow(imgShow - 1) : ""
                    }}>
                        <IconChevronLeft stroke={1.5} width={20} height={20} />
                    </div>
                    <div className="btn right p-1 bg-white/[.8] backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white" onClick={(e) => {
                        e.preventDefault()
                        imgShow < 2 ? setImgSHow(imgShow + 1) : ""
                    }}>
                        <IconChevronRight stroke={1.5} width={20} height={20} />
                    </div>
                </div>
            </div>
            <div className="info flex flex-col">
                <div className="top flex items-center justify-between">
                    <div className="nama font-semibold text-ellipsis overflow-hidden whitespace-nowrap max-w-[85%]">{kos.name}</div>
                    {/* <div className="rating flex items-center">
                        <IconStar stroke={1.5} width={12} height={12} className="text-primary fill-primary" />
                        <span>{kos.rating}</span>    
                    </div> */}
                </div>
                <div className="harga text-sm mt-2">{Currency(kos.price).encode()}/bulan</div>
                <div className="flex items-center justify-between text-xs mt-2">
                    <div className="flex items-center py-1 px-2 rounded-lg border gap-2">
                        <IconMap stroke={1.5} width={16} height={16} />
                        <span>{kos.city}</span>
                    </div>
                    <div className="flex items-center py-1 px-2 rounded-lg border gap-2">
                        <IconUser stroke={1.5} width={16} height={16} />
                        <span>{kos.consumer_name}</span>
                    </div>
                </div>
                {/* <div className="jarak text-ellipsis overflow-hidden whitespace-nowrap text-[#717171]">Berjarak {kos.jarak} kilometer</div>
                <div className="tanggal-bulan">{kos.tanggal[0]}-{kos.tanggal[1]} {kos.bulan}</div> */}
            </div>
        </Link>
    )
}

export function KosSkeleton(){
    return (
        <div className="kos-skeleton flex flex-col gap-2">
            <div className="img rounded-lg w-full pt-[95%] bg-[#ddd]"></div>
            <div className="content flex flex-col gap-2">
                <div className="name-rating w-full flex gap-2 items-center h-4">
                    <div className="name w-[90%] h-full bg-[#ddd]"></div>
                    <div className="rating w-[10%] h-full bg-[#ddd]"></div>
                </div>
                <div className="jarak w-1/2 h-4 bg-[#ddd]"></div>
                <div className="tanggal w-[30%] h-4 bg-[#ddd]"></div>
                <div className="harga w-1/2 h-4 bg-[#ddd]"></div>
            </div>
        </div>
    )
}