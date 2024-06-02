"use client"

import { StringifiedDOTToSearchParams, StringifyDOT } from "@/logic/dot/StringifyDOT";
import parse from "dotparser";
import { useRouter } from "next/router";
import { useEffect } from "react";

const DOT = `
strict graph G {
    a
    b
    c
    d
    e
    f
    g
    h
    
    a -- c
    a -- d
    a -- f
    
    b -- e
    b -- g
    b -- h
    
    c -- f
    c -- e
    
    d -- e
    d -- f
    
    e -- g
    e -- h
    
    g -- h
}`;

export default function Example2() {
    const router = useRouter();

    useEffect(() => {
        router.push(`/dot?` + StringifiedDOTToSearchParams(StringifyDOT(parse(DOT))));
    }, [router])


    return <></>
}