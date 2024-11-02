export function getBrowserNameFromUserAgent() {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edg')) return 'Edge';
    if (userAgent.includes('OPR') || userAgent.includes('Opera')) return 'Opera';
    if (userAgent.includes('MSIE') || userAgent.includes('Trident')) return 'Internet Explorer';

    return 'Unknown';
}

export function getBrowserName() {
    if (navigator.userAgentData) {
        const brands = navigator.userAgentData.brands;
        for(const brand of ['Chrome', 'Firefox', 'Safari', 'Edge']){
            const browserBrand = brands.find(brand => 
                brand.brand.includes('Chrome') ||
                brand.brand.includes('Firefox') ||
                brand.brand.includes('Safari') ||
                brand.brand.includes('Edge')
            );
            if(browserBrand){
                return brand;
            }
        }
    }

    return getBrowserNameFromUserAgent();
}
