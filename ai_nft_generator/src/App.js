import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

// Components
import Spinner from 'react-bootstrap/Spinner';
import Navigation from './components/Navigation';

// ABIs
import NFT from './abis/NFT.json';

// Config
import config from './config.json';

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [nft, setNFT] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [localImageURL, setLocalImageURL] = useState(null); // Store local file URL

  const [message, setMessage] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();

    const nft = new ethers.Contract(config[network.chainId].nft.address, NFT, provider);
    setNFT(nft);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (name === "" || description === "") {
      window.alert("Please provide a name and description");
      return;
    }

    setIsWaiting(true);

    // Call AI API to generate an image based on the description
    const imageData = await createImage();

    // Store image locally
    const localURL = await saveImageLocally(imageData);

    // Mint NFT (without storing on NFT.Storage)
    await mintImage(localURL);

    setIsWaiting(false);
    setMessage("");
  };

  const createImage = async () => {
    setMessage("Generating Image...");
  
    const URL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2`;
  
    const response = await axios({
      url: URL,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        inputs: description,
        options: { wait_for_model: true },
      }),
      responseType: 'arraybuffer', // Get image as binary data
    });
  
    const type = response.headers['content-type'];
    const uint8Array = new Uint8Array(response.data); // Convert to Uint8Array
  
    const base64data = btoa(
      uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
  
    const img = `data:${type};base64,` + base64data; // Create data URL
    setImage(img);
  
    return response.data; 
  };
  

  const saveImageLocally = async (imageData) => {
    setMessage("Saving Image Locally...");
    const blob = new Blob([imageData], { type: "image/jpeg" });
    const localURL = URL.createObjectURL(blob);
    setLocalImageURL(localURL);
    return localURL;
  };

  const mintImage = async (imageURI) => {
    setMessage("Waiting for Mint...");
    const signer = await provider.getSigner();
    const transaction = await nft.connect(signer).mint(imageURI, { value: ethers.utils.parseUnits("1", "ether") });
    await transaction.wait();
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />

      <div className='form'>
        <form onSubmit={submitHandler}>
          <input type="text" placeholder="Create a name..." onChange={(e) => setName(e.target.value)} />
          <input type="text" placeholder="Create a description..." onChange={(e) => setDescription(e.target.value)} />
          <input type="submit" value="Create & Mint" />
        </form>

        <div className="image">
          {!isWaiting && image ? (
            <img src={image} alt="AI generated" />
          ) : isWaiting ? (
            <div className="image__placeholder">
              <Spinner animation="border" />
              <p>{message}</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Show locally stored image */}
      {!isWaiting && localImageURL && (
        <p>
          View&nbsp;
        </p>
      )}
    </div>
  );
}

export default App;
