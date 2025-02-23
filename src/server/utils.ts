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

export async function getEnvRegion(): Promise<string> {
    const ip = getEnvIp();

    // Skip lookup for localhost/private IPs
    if (ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
        return "local";
    }

    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();

        if (!data.error && data.region) {
            return data.region.toLowerCase() as string;
        }
    } catch (error) {
        console.warn("Failed to lookup IP geolocation:", error);
    }

    return "unknown";
}
