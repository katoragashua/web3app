import { useState } from "react";
import abi from "./abi.json";
import { ethers } from "ethers";

const contractAddress = "0x59141CB9369bcf91068d0B4190Ae3DEa2725C803"; // Replace with your contract address

function App() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function requestAccount() {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.error("Error requesting account:", error);
      alert("Please install MetaMask to use this application.");
      setError(error.message || "MetaMask not found");
    }
  }

  const handleSet = async () => {
    try {
      if (!text) {
        alert("Please enter a message before setting.");
        setError("Please enter a message before setting.");
        setTimeout(() => setError(""), 2000);
        return;
      }

      if (window.ethereum) {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.setMessage(text);
        const txReceipt = await tx.wait();
        console.log("Transaction successful:", txReceipt);
      } else {
        console.error(
          "MetaMask not found. Please install MetaMask to use this application."
        );
      }
    } catch (error) {
      console.error("Error setting message:", error.info?.error?.message);
      alert(error.info?.error?.message || error);
      setError(error.info?.error?.message || "An error occurred while setting the message.");
    }
  };

  const getMessage = async () => {
    try {
      if (window.ethereum) {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const message = await contract.getMessage();
        setMessage(message);
        console.log("Current message:", message);
        alert(`Current message: ${message}`);
      } else {
        console.error(
          "MetaMask not found. Please install MetaMask to use this application."
        );
      }
    } catch (error) {
      console.error("Error getting message:", error.info?.error?.message);
      alert(error.info?.error?.message || error);
      setError(error.info?.error?.message || "An error occurred while getting the message.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div className="container">
        <h1>Set Message on Smart Contract</h1>
        <main className="main">
          <div className="set-message">
            <input
              type="text"
              placeholder="Set message"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button onClick={handleSet}>Set Message</button>
          </div>
          <div className="get-message">
            <button onClick={getMessage}>Get Message</button>
            <h2>{message}</h2>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
