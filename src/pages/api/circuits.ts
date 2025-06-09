import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  const response = {
  "content": [
    {
      "id": "4900000000",
      "callerid": "4900000000",
      "username": "4900000000",
      "password": "jtqfa3xlWR",
      "ip": null,
      "rtt": null,
      "online": false
    },
    {
      "id": "4900000001",
      "callerid": "4900000001",
      "username": "4900000001",
      "password": "EaWtvmfIbh",
      "ip": null,
      "rtt": null,
      "online": false
    },
    {
      "id": "4900000002",
      "callerid": "4900000002",
      "username": "4900000002",
      "password": "XTaWGMIOD3",
      "ip": null,
      "rtt": null,
      "online": false
    },
    {
      "id": "4900000003",
      "callerid": "4900000003",
      "username": "4900000003",
      "password": "P4fUCMFJoZ",
      "ip": null,
      "rtt": null,
      "online": false
    },
    {
      "id": "4900000004",
      "callerid": "4900000004",
      "username": "4900000004",
      "password": "kpuNMR2A5X",
      "ip": null,
      "rtt": null,
      "online": false
    },
    {
      "id": "4900000005",
      "callerid": "4900000005",
      "username": "4900000005",
      "password": "k6K1Cwe6ip",
      "ip": null,
      "rtt": null,
      "online": false
    },
    {
      "id": "4900000006",
      "callerid": "4900000006",
      "username": "4900000006",
      "password": "9tSNBceXTI",
      "ip": null,
      "rtt": null,
      "online": false
    },
    {
      "id": "4900000007",
      "callerid": "4900000007",
      "username": "4900000007",
      "password": "trGjsjtn45",
      "ip": null,
      "rtt": null,
      "online": false
    },
    {
      "id": "4900000008",
      "callerid": "4900000008",
      "username": "4900000008",
      "password": "gK0m9InbRf",
      "ip": null,
      "rtt": null,
      "online": false
    },
    {
      "id": "4900000009",
      "callerid": "4900000009",
      "username": "4900000009",
      "password": "tDrdWQe3W0",
      "ip": null,
      "rtt": null,
      "online": false
    },
    {
      "id": "4900000010",
      "callerid": "4900000010",
      "username": "4900000010",
      "password": "JrbIZ6Da5O",
      "ip": null,
      "rtt": null,
      "online": false
    },
    {
      "id": "4900000011",
      "callerid": "4900000011",
      "username": "4900000011",
      "password": "Vz3S4HInYW",
      "ip": null,
      "rtt": null,
      "online": false
    },
    {
      "id": "4900000012",
      "callerid": "4900000012",
      "username": "4900000012",
      "password": "SyuMwM1FxR",
      "ip": null,
      "rtt": null,
      "online": false
    },
    {
      "id": "4900000013",
      "callerid": "4900000013",
      "username": "4900000013",
      "password": "ChR66vPtzC",
      "ip": null,
      "rtt": null,
      "online": false
    },
    {
      "id": "4900000014",
      "callerid": "4900000014",
      "username": "4900000014",
      "password": "8Hclfx2IQY",
      "ip": null,
      "rtt": null,
      "online": false
    },
    {
      "id": "4900000015",
      "callerid": "4900000015",
      "username": "4900000015",
      "password": "sEQ9EkLMts",
      "ip": null,
      "rtt": null,
      "online": false
    },
    {
      "id": "4900000016",
      "callerid": "4900000016",
      "username": "4900000016",
      "password": "FTnR3ZimsO",
      "ip": null,
      "rtt": null,
      "online": false
    },
    {
      "id": "4900000017",
      "callerid": "4900000017",
      "username": "4900000017",
      "password": "YmpBDOMA2e",
      "ip": null,
      "rtt": null,
      "online": false
    },
    {
      "id": "4900000018",
      "callerid": "4900000018",
      "username": "4900000018",
      "password": "wXQESIOJQP",
      "ip": null,
      "rtt": null,
      "online": false
    },
    {
      "id": "4900000019",
      "callerid": "4900000019",
      "username": "4900000019",
      "password": "dLVETY1AUI",
      "ip": null,
      "rtt": null,
      "online": false
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20,
    "sort": {
      "sorted": false,
      "empty": true,
      "unsorted": true
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "last": false,
  "totalPages": 30,
  "totalElements": 600,
  "size": 20,
  "number": 0,
  "sort": {
    "sorted": false,
    "empty": true,
    "unsorted": true
  },
  "first": true,
  "numberOfElements": 20,
  "empty": false
};
  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

