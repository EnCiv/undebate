
 const resolutionToFontSizeTable= {
    //Apple iPhone X
    "812x375x3": 13,

    // Apple iPhone 6+, 6s+, 7+, 8+
    "736x414x3": 13,

    //Apple iPhone 7, iPhone 8
    //Apple iPhone 6, 6s
    "667x375x2": 9,

    //Apple iPhone 5
    "568x320x2": 9,

    //Apple iPhone 4
    "480x320x2": 9,

    //Apple iPhone 3
    "480x320x1": 4.36,

    //Apple iPod Touch
    "568x320x2": 9,

    //Samsung Galaxy S8+, S8
    "740x360x4": 17,

    //Samsung Galaxy S7, S7 edge, S6
    "640x360x4": 17,

    //Samsung Galaxy S5, S4,
    "640x360x3": 13,

    //Samsung Galaxy S4 mini
    "640x360x1.5": 6.5,

    //Samsung Galaxy S3,
    "640x360x2": 8.75,

    //Samsung Galaxy S3 mini, S2, S
    "533x320x1.5": 6.5,

    //Samsung Galaxy Nexus
    "600x360x2": 9,

    // Pixel 2
    "731x411x2.625": 13,

    // Pixel 2  XL
    "823x411x3.5": 14,

    // iPad
    "1024x768x2": 15,

    // iPad Pro
    "1366x1024x2": 21,
    
    //Note 8
    "846x412x2.625": 13,

    // 4K desktop
    "4096x2160x1": 0
}

module.exports.default=resolutionToFontSizeTable;
module.exports.resolutionToFontSizeTable=resolutionToFontSizeTable;
