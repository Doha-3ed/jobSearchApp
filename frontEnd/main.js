import {io} from "socket.io-client"

const clientId=io("http://localhost:4000")
clientId.emit("registerUser", "HR_USER_ID")
clientId.on("newApplication", (data) => {
    console.log("New job application received:", data);
    alert(`New application for Job ID: ${data.jobId}`);
});