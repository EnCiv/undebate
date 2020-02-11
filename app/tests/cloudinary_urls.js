"user strict;"

import {auto_quality, placeholder_image} from "../components/lib/cloudinary-urls";

// quick and dirty testing until we get a test platform defined

global.logger={error: console.error};


var initial="https://res.cloudinary.com/hf6mryjpf/video/upload/v1581063510/5e3d18093ebd3a0017d9621b-0-speaking20200207T081823130Z.webm";
var expected="https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1581063510/5e3d18093ebd3a0017d9621b-0-speaking20200207T081823130Z.mp4";
var got;
var errors=0;
if((got=auto_quality(initial)) !== expected) console.error("auto_quality(",initial,") got", got, "expected", expected, "errors", ++errors);
expected="https://res.cloudinary.com/hf6mryjpf/video/upload/so_0/v1581063510/5e3d18093ebd3a0017d9621b-0-speaking20200207T081823130Z.png";
if((got=placeholder_image(initial)) !== expected) console.error("placeholder_image(",initial,") got", got, "expected", expected, "errors", ++errors);

initial="https://res.cloudinary.com/hf6mryjpf/video/upload/w_300,h_200,c_crop/v1581063510/5e3d18093ebd3a0017d9621b-0-speaking20200207T081823130Z.webm"
expected="https://res.cloudinary.com/hf6mryjpf/video/upload/w_300,h_200,c_crop,q_auto/v1581063510/5e3d18093ebd3a0017d9621b-0-speaking20200207T081823130Z.mp4"
if((got=auto_quality(initial)) !== expected) console.error("auto_quality(",initial,") got", got, "expected", expected, "errors", ++errors);
expected="https://res.cloudinary.com/hf6mryjpf/video/upload/w_300,h_200,c_crop,so_0/v1581063510/5e3d18093ebd3a0017d9621b-0-speaking20200207T081823130Z.png"
if((got=placeholder_image(initial)) !== expected) console.error("placeholder_image(",initial,") got", got, "expected", expected, "errors", ++errors);

initial="https://res.cloudinary.com/hf6mryjpf/video/upload/w_300,h_200,c_crop/extra/parts/dont/work/v1581063510/5e3d18093ebd3a0017d9621b-0-speaking20200207T081823130Z.webm"
expected="https://res.cloudinary.com/hf6mryjpf/video/upload/w_300,h_200,c_crop/extra/parts/dont/work/v1581063510/5e3d18093ebd3a0017d9621b-0-speaking20200207T081823130Z.mp4"
if((got=auto_quality(initial)) !== expected) console.error("auto_quality(",initial,") got", got, "expected", expected, "errors", ++errors);
expected="https://res.cloudinary.com/hf6mryjpf/video/upload/w_300,h_200,c_crop/extra/parts/dont/work/v1581063510/5e3d18093ebd3a0017d9621b-0-speaking20200207T081823130Z.png"
if((got=placeholder_image(initial)) !== expected) console.error("placeholder_image(",initial,") got", got, "expected", expected, "errors", ++errors);

if(!errors)console.info("pass");
else console.error("failed. errors:",errors);
process.exit(errors);
