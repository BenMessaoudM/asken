"use client";
import { useEffect } from "react";

export default function ThemeController(){useEffect(()=>{fetch("/api/public/theme").then(r=>r.json()).then(data=>{document.documentElement.dataset.askTheme=data.theme||"default"}).catch(()=>{document.documentElement.dataset.askTheme="default"})},[]);return null}
