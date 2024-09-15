'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Wallet, Download, ExternalLink } from 'lucide-react';
import Web3 from 'web3';
import CertiABI from '../../certificate.json';
import axios from 'axios';

// Mock data for certificates
const mockCertificates = [
    {
        id: 'CERT123',
        name: 'Web Development Certificate',
        issueDate: '2023-05-15',
        imageUrl: '/placeholder.svg?height=200&width=300',
    },
    {
        id: 'CERT456',
        name: 'Blockchain Fundamentals',
        issueDate: '2023-06-20',
        imageUrl: '/placeholder.svg?height=200&width=300',
    },
    {
        id: 'CERT789',
        name: 'Advanced JavaScript',
        issueDate: '2023-07-10',
        imageUrl: '/placeholder.svg?height=200&width=300',
    },
];

export default function CertificateGallery() {
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [certificates, setCertificates] = useState([]);
    const [walletAddress, setWalletAddress] = useState('');

    const connectWallet = async () => {
        // Simulate wallet connection
        try {
            if (window.ethereum) {
                // const accounts = await window.etherum.request({
                //     method: 'eth_requestAccounts',
                // });
                const web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                console.log(accounts);
                setWalletAddress(accounts[0]);

                setIsWalletConnected(true);
            } else {
                console.log('Else');
            }
        } catch (e) {
            console.log(e);
            alert('wallet not installed');
        }
    };

    const getCertificates = async () => {
        try {
            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(CertiABI, contractAddress);
            const res = await contract.methods
                .getCertificates(walletAddress)
                .call();
            await getCertificateData(res);
        } catch (e) {
            alert(e);
        }
    };

    useEffect(() => {
        if (walletAddress) {
            getCertificates();
            console.log(walletAddress);
        }
    }, [walletAddress]);

    const getCertificateData = async (certificateIDs) => {
        try {
            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(CertiABI, contractAddress);
            const certificateURLPromises = certificateIDs.map(
                (certificateId) => {
                    const url = contract.methods.tokenURI(certificateId).call();
                    // const response = axios.get(url);
                    // return response;
                    return url;
                }
            );
            const certificateURLs = await Promise.all(certificateURLPromises);
            // console.log('urls', certificateURLs);
            const certificateDataPromises = certificateURLs.map((url) => {
                console.log(url);
                return axios.get(url);
            });

            const certificatesDataArray = await Promise.all(
                certificateDataPromises
            );
            console.log('certificare array', certificatesDataArray);
            let i = 0;
            const finalData = certificatesDataArray.map((certificate) => {
                return {
                    image:
                        'https://tomato-geographical-pig-904.mypinata.cloud/ipfs/' +
                        certificate.data.image.split('/')[4],
                    id: certificateIDs[i++],
                    description: certificate.data.description,
                };
            });
            // console.log("certificare",finalData);
            setCertificates(finalData);
            // console.log(finalData);
            // setLoading(false);
        } catch (error) {
            console.error('Error fetching certificate data:', error);
        }
    };

    const handleDownload = (certificate) => {
        // In a real app, this would trigger the actual download
        alert(`Downloading certificate: ${certificate.name}`);
    };

    const handleView = (certificate) => {
        window.open(certificate.image, '_blank');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Your Certificates</h1>

            {!isWalletConnected ? (
                <Button onClick={connectWallet} className="mb-6">
                    <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
                </Button>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert) => (
                        <Card key={cert.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle>{cert.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <img
                                    src={cert.image}
                                    alt={cert.name}
                                    className="w-full h-40 object-cover rounded-md"
                                />
                                <p className="mt-2 text-sm text-gray-600">
                                    Description: {cert.description}
                                </p>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button
                                    variant="outline"
                                    onClick={() => handleDownload(cert)}
                                >
                                    <Download className="mr-2 h-4 w-4" />{' '}
                                    Download
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleView(cert)}
                                >
                                    <ExternalLink className="mr-2 h-4 w-4" />{' '}
                                    View
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {isWalletConnected && certificates.length === 0 && (
                <p className="text-center text-gray-600">
                    No certificates found.
                </p>
            )}
        </div>
    );
}
