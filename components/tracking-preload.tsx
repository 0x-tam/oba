'use client';
import {useEffect} from 'react';
import {preloadHandTracking} from '@/lib/tracking-preload';
export default function TrackingPreload(){
 useEffect(()=>{void preloadHandTracking()},[]);
 return null;
}
