const authKey = "491266AqsX3mD29Cew69c118abP1";
const templateId = "69ea1def482afb266f06a9b2";
const phone = "8825702072";

async function testPost() {
  const response = await fetch("https://control.msg91.com/api/v5/otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "authkey": authKey
    },
    body: JSON.stringify({
      mobile: "91" + phone,
      template_id: templateId,
      otp_length: 4
    })
  });
  console.log("POST Body Response:", await response.text());
}

async function testGet() {
  const url = `https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=91${phone}&otp_length=4`;
  const response = await fetch(url, {
    method: "POST", // MSG91 can accept POST with params
    headers: {
      "authkey": authKey
    }
  });
  console.log("POST Params Response:", await response.text());
}

async function testGet2() {
  const url = `https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=91${phone}&otp_length=4`;
  const response = await fetch(url, {
    method: "GET", // Or GET
    headers: {
      "authkey": authKey
    }
  });
  console.log("GET Params Response:", await response.text());
}

async function main() {
  await testPost();
  await testGet();
  await testGet2();
}

main().catch(console.error);
