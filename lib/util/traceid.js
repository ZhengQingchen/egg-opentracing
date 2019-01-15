"use strict";

const localIp = require("address").ip();

exports.generate = generate;
exports.getHexIP = getHexIP;
exports.getNextId = getNextId;

const crypto = require("crypto");
function md5(data) {
  let hash = crypto.createHash("md5");
  return hash.update(data).digest("hex");
}

function getHexIP(ip) {
  const ips = ip.split(".");
  let val = "";
  for (const column of ips) {
    let hex = Number(column).toString(16);
    if (hex.length === 1) {
      hex = "0" + hex;
    }
    val += hex;
  }
  return val;
}

let tracerRequestId = 1000;
// NextID is between 1000 and 9000
function getNextId() {
  if (tracerRequestId > 9000) {
    tracerRequestId = 1000;
  }
  return tracerRequestId++;
}

const HEX_IP = getHexIP(localIp);
const PID = process.pid;

/**
 * traceId generator, it will be composed by the following
 *
 * 1. convert ipv4 to 32-bit hex string
 * 2. timestamp
 * 3. increment number between 1000 and 9000
 * 4. process id
 *
 * @return {String} TraceId
 */
function generate() {
  return md5(HEX_IP + Date.now() + getNextId() + PID);
}
