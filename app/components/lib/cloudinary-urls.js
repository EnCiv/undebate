"use strict;"

const basic='basic';
const long='long';
const unknown='unknown';


// basic url looks like
// https://res.cloudinary.com/hf6mryjpf/video/upload/v1581063510/5e3d18093ebd3a0017d9621b-0-speaking20200207T081823130Z.mp4
//
// long url look like
// https://res.cloudinary.com/hf6mryjpf/video/upload/w_300,h_200,c_crop/v1581063510/5e3d18093ebd3a0017d9621b-0-speaking20200207T081823130Z.mp4


function url_check(parts){
    if(parts.length===8 && parts[5]==='upload' && parts[6][0]==='v' && parts[6].length===11){
        return basic;
    } else if(parts.length===9 && parts[5]==='upload' && parts[7][0]==='v' && parts[7].length===11) {
        return long;
    }else {
        logger.error("cloudinary url test, didn't recognize", parts.join('/'))
        return unknown;
    }
}
export function auto_quality(url){
    let parts=url.split('/');
    // add the q_auto transform
    switch(url_check(parts)){
        case unknown:
            break; // can't add the transform - but at least try to change the ending;
        case long:
            if(parts[6].includes('q_auto')) break;
            parts[6]=parts[6]+',q_auto';
            break;
        case basic:
            parts.splice(6,0,'q_auto');
            break;
    }
    // now make it end with mp4
    let end=parts[parts.length-1].split('.');
    end[end.length-1]='mp4';
    parts[parts.length-1]=end.join('.');
    let result=parts.join('/');
    return result;
}

export function placeholder_image(url){
    let parts=url.split('/');
    // add the q_auto transform
    switch(url_check(parts)){
        case unknown:
            break; // can't add the transform but at least try to change the ending
        case long:
            if(parts[6].includes('so_0')) break;
            parts[6]=parts[6]+',so_0';
            break;
        case basic:
            parts.splice(6,0,'so_0');
            break;
    }
    // now make it end with mp4
    let end=parts[parts.length-1].split('.');
    end[end.length-1]='png';
    parts[parts.length-1]=end.join('.');
    let result=parts.join('/');
    return result;
}

export default {auto_quality, placeholder_image};
