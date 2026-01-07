"use strict";

const { Toxiproxy } = require("toxiproxy-node-client");

const toxiproxy = new Toxiproxy("http://localhost:8474");

async function setupProxy() {
    try {
        // Create proxy
        let proxy;
        try {
            proxy = await toxiproxy.getProxy("members_proxy");
            console.log("Proxy already exists:", proxy.listen);
        } catch {
            proxy = await toxiproxy.createProxy({
                name: "1members_proxy",
                listen: "0.0.0.0:8666",  
                upstream: "host.docker.internal:3000"
            });
            console.log("Proxy created:", proxy.listen);
        }

        // Add latency toxic
        const toxic = await proxy.addToxic({
            type: "latency",
            attributes: {
                latency: 2000, 
                jitter: 100
            },
            stream: "upstream"
        });
        console.log("Latency toxic added:", toxic.type);

        console.log("Now you can make POST/GET requests to http://localhost:8666/members to see latency effect.");
    } catch (err) {
        console.error("Error setting up proxy:", err.message);
    }
}

module.exports = { setupProxy };
