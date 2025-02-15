import geoip from 'geoip-lite'
import os from 'os'

export function getEnvIp() {
    const networkInterfaces = os.networkInterfaces()

    for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName]
        if (!interfaces) continue

        for (const interface_ of interfaces) {
            if (interface_.family === 'IPv4' && !interface_.internal) {
                return interface_.address
            }
        }
    }

    return "127.0.0.1";
}

export function getEnvRegion() {
    const ip = getEnvIp();

    // Skip lookup for localhost/private IPs
    if (ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
        return "local";
    }

    try {
        const geo = geoip.lookup(ip);
        if (geo) {
            // Return the region or country code if region is not available
            return geo.region || geo.country || "unknown";
        }
    } catch (error) {
        console.warn("Failed to lookup IP geolocation:", error);
    }

    return "unknown";
}
