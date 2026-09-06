"use client";
import { useEffect, useState } from "react";
import CorContext from "@/components/cor-context";

export default function CorContextGlobal(){const[path,setPath]=useState("");useEffect(()=>setPath(location.pathname),[]);if(path!=="/cor"&&path!=="/cor-huset")return null;return <CorContext lang={path==="/cor"?"en":"sv"}/>}
