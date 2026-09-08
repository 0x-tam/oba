export function ArrowIcon({direction='diagonal'}:{direction?:'diagonal'|'left'|'right'|'up'|'down'}) {
 const paths={diagonal:'M5 19 19 5M5 5h14v14',left:'M20 12H4m8-8-8 8 8 8',right:'M4 12h16m-8-8 8 8-8 8',up:'M12 20V4m-8 8 8-8 8 8',down:'M12 4v16m-8-8 8 8 8-8'};
 return <svg className="arrow-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false"><path d={paths[direction]}/></svg>;
}
