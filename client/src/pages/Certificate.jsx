import { APP_NAME } from '@/constant';
import html2canvas from 'html2canvas';
import React from 'react';
import Web3 from 'web3';
import CertiABI from '../../certificate.json';

const JWT = import.meta.env.VITE_IPFS_JWT;

function Certificate({
    name = 'John Doe',
    university = 'GTU',
    course = 'Web Development',
    issueDate = 'June 4, 2022',
    courseID = '1245',
}) {
    const getImgData = async () => {
        const capture = document.querySelector('.certificate-container');
        const canvas = await html2canvas(capture);
        const imgData = canvas.toDataURL('/img/png');
        console.log(imgData);
        return imgData;
    };

    const uploadimgToIPFS = async (imgData) => {
        const image = new FormData();
        const imageData = await fetch(imgData);
        const blob = await imageData.blob();
        image.append('file', blob);
        try {
            const res = await axios.post(
                'https://api.pinata.cloud/pinning/pinFileToIPFS',
                image,
                {
                    maxBodyLength: 'Infinity',
                    headers: {
                        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                        Authorization: JWT,
                    },
                }
            );
            return res;
        } catch (error) {
            console.log(error);
        }
    };

    const uploadMetadatatoIPFS = async (hash) => {
        const data = JSON.stringify({
            pinataContent: {
                name: name,
                description: `Certificate of completion of course of ${course}`,
                image:
                    'https://tomato-geographical-pig-904.mypinata.cloud/ipfs/' +
                    hash,
                attributes: [
                    { trait_type: 'CourseName', value: instituteName },
                    { trait_type: 'Date', value: issueDate },
                ],
            },
            pinataMetadata: {
                name: 'metadata.json',
            },
        });

        try {
            const res = await axios.post(
                'https://api.pinata.cloud/pinning/pinJSONToIPFS',
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: JWT,
                    },
                }
            );
            return res;
        } catch (error) {
            console.log(error);
        }
    };

    const contractCall = async (hash) => {
        const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(CertiABI, contractAddress);
            const transaction = await contract.methods
                .awardItem(
                    courseID,
                    'https://tomato-geographical-pig-904.mypinata.cloud/ipfs/' +
                        hash
                )
                .send({ from: accounts[0] });
        } catch (error) {
            console.log(error);
        }
    };

    const generateCertificate = async () => {
        const imgData = await getImgData();
        console.log('connect', imgData);
        const res = await uploadimgToIPFS(imgData);
        console.log('res.data', res.data.IpfsHash);
        const res2 = await uploadMetadatatoIPFS(res.data.IpfsHash);
        await contractCall(res2.data.IpfsHash);
    };
    return (
        <>
            <div
                class="container mx-auto p-8"
                className="certificate-container"
            >
                <div class="bg-gray-100 p-6 rounded-lg shadow-md">
                    <div class="flex justify-center items-center font-semibold text-3xl pt-6">
                        {APP_NAME}
                    </div>

                    <h2 class="text-2xl font-bold text-center mt-6">
                        CERTIFICATE OF COMPLETION
                    </h2>

                    <p class="text-center mt-4">This certifies that</p>

                    <h3 class="text-2xl font-bold text-center mt-4">{name}</h3>

                    <p class="text-center mt-4">
                        has completed the necessary courses of study and passed
                        the {APP_NAME}
                        's exam and is hereby declared a
                    </p>

                    <h2 class="text-2xl font-bold text-center mt-4">
                        {course}
                    </h2>

                    <p class="text-center mt-4">from {university}.</p>

                    <p className="text-lg mt-3 text-center">
                        Issued on{' '}
                        <span className=" font-semibold">{issueDate}</span>
                    </p>

                    <div class="ml-auto">
                        <div className="flex flex-col w-fit ml-auto mr-5 items-center justify-center">
                            <img
                                src="https://images.squarespace-cdn.com/content/v1/5ccdb76f815512805916ddc5/799c938d-ec3f-4ce0-80cf-ed72bf3f887c/SILVER6.png?format=500w"
                                alt="Signature"
                                class="h-10 w-36"
                            />
                            <hr />
                            <p className="text-xl text-center">
                                Yash Zanzarukiya
                            </p>
                            <p className="text-xl text-center">
                                from {APP_NAME}
                            </p>
                        </div>
                    </div>
                    <p class="text-sm text-left mt-2">
                        Verify completion at http://localhost:3000/1MN4DGVZJU
                    </p>
                </div>
            </div>
        </>

        // <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-100">
        //   <div className=" p-8 bg-white shadow-lg rounded-lg">
        //     <h1 className="text-3xl font-bold mb-4">Certificate of Completion</h1>
        //     <div className="mb-6">
        //       <p className="text-lg">
        //         This is to certify that <span className="font-bold">John Doe</span>{' '}
        //         has successfully completed the course
        //         <span className="font-bold"> Web Development</span> on{' '}
        //         <span className="font-bold">January 1, 2022 </span>
        //         from <span className="font-bold">University of Example</span>.
        //       </p>
        //     </div>
        //     <div className="flex justify-between">
        //       <p className="text-sm">
        //         Certificate ID: <span className="font-bold">ABC123</span>
        //       </p>
        //       <p className="text-sm">
        //         Date: <span className="font-bold">January 1, 2022</span>
        //       </p>
        //     </div>
        //   </div>
        // </div>
    );
}

export default Certificate;
