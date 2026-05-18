const axios = require("axios");
require("dotenv").config();

const Log = require("./logger");

const headers = {
    Authorization: `Bearer ${process.env.TOKEN}`
};

async function fetchDepots() {

    try {

        const response = await axios.get(
            "http://4.224.186.213/evaluation-service/depots",
            { headers }
        );

        await Log(
            "backend",
            "info",
            "service",
            "Fetched depot data"
        );

        return response.data.depots;

    } catch (error) {

        await Log(
            "backend",
            "error",
            "service",
            "Failed to fetch depots"
        );

        console.log(error.message);
    }
}

async function fetchVehicles() {

    try {

        const response = await axios.get(
            "http://4.224.186.213/evaluation-service/vehicles",
            { headers }
        );

        await Log(
            "backend",
            "info",
            "service",
            "Fetched vehicle data"
        );

        return response.data.vehicles;

    } catch (error) {

        await Log(
            "backend",
            "error",
            "service",
            "Failed to fetch vehicles"
        );

        console.log(error.message);
    }
}

function knapsack(vehicles, maxHours) {

    const n = vehicles.length;

    const dp = Array(n + 1)
        .fill()
        .map(() => Array(maxHours + 1).fill(0));

    for (let i = 1; i <= n; i++) {

        const duration = vehicles[i - 1].Duration;
        const impact = vehicles[i - 1].Impact;

        for (let w = 0; w <= maxHours; w++) {

            if (duration <= w) {

                dp[i][w] = Math.max(
                    impact + dp[i - 1][w - duration],
                    dp[i - 1][w]
                );

            } else {

                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    let selectedVehicles = [];

    let w = maxHours;

    for (let i = n; i > 0; i--) {

        if (dp[i][w] !== dp[i - 1][w]) {

            selectedVehicles.push(vehicles[i - 1]);

            w -= vehicles[i - 1].Duration;
        }
    }

    return {
        maxImpact: dp[n][maxHours],
        selectedVehicles
    };
}

async function main() {

    const depots = await fetchDepots();

    const vehicles = await fetchVehicles();

    for (const depot of depots) {

        const result = knapsack(
            vehicles,
            depot.MechanicHours
        );

        console.log("\n=================================");
        console.log(`Depot ID: ${depot.ID}`);
        console.log(`Mechanic Hours: ${depot.MechanicHours}`);
        console.log(`Maximum Impact: ${result.maxImpact}`);

        console.log("\nSelected Vehicles:");

        result.selectedVehicles.forEach(vehicle => {

            console.log(
                `TaskID: ${vehicle.TaskID}
Duration: ${vehicle.Duration}
Impact: ${vehicle.Impact}\n`
            );
        });

        await Log(
            "backend",
            "info",
            "handler",
            `Optimized depot ${depot.ID}`
        );
    }
}

main();