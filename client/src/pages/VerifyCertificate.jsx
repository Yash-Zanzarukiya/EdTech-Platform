'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ExternalLink, Download } from 'lucide-react';
import Web3 from 'web3';
import CertiABI from '../../certificate.json';
import axios from 'axios';

// Mock function to simulate certificate verification
const verifyCertificate = async (id) => {
    if (!window.ethereum) {
        setVerificationResult('');
        toast.error(
            "You don't have any web3 wallet or web3 instance!! Or you haven't added the certificateID",
            {
                position: 'bottom-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
                transition: Slide,
            }
        );
        return;
    }

    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(CertiABI, contractAddress);
        console.log(id.split('/')[1]);
        const url = await contract.methods.tokenURI(id.split('/')[1]).call();

        console.log(url);
        const newUrl =
            'https://tomato-geographical-pig-904.mypinata.cloud/ipfs/' +
            url.split('/')[4];
        const res = await axios.get(newUrl);
        const data = {
            id: id,
            imageUrl: res.data.image,
            blockExplorerLink:
                'https://sepolia.etherscan.io/nft/0x1f83f0edb2f818fbe858a77070f929b375162b8c/' +
                parseInt(id.split('/')[1]),
            openSeaLink:
                'https://testnets.opensea.io/assets/sepolia/0x1f83f0edb2f818fbe858a77070f929b375162b8c/' +
                parseInt(id.split('/')[1]),
        };
        return data;
    } catch (error) {
        console.log(error);
    }
    return null;
};

export default function CertificateVerifier() {
    const [certificateId, setCertificateId] = useState('');
    const [certificate, setCertificate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setCertificate(null);

        try {
            const result = await verifyCertificate(certificateId);
            if (result) {
                setCertificate(result);
            } else {
                setError(
                    'Certificate not found. Please check the ID and try again.'
                );
            }
        } catch (err) {
            console.log(err);
            setError('An error occurred while verifying the certificate.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async () => {
        // In a real app, this would trigger the image download
        alert('Downloading certificate image...');
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Certificate Verifier</CardTitle>
                <CardDescription>
                    Enter a certificate ID to verify and view details.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="certificateId">Certificate ID</Label>
                        <Input
                            id="certificateId"
                            value={certificateId}
                            onChange={(e) => setCertificateId(e.target.value)}
                            placeholder="Enter certificate ID"
                            required
                        />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Verifying...' : 'Verify Certificate'}
                    </Button>
                </form>

                {error && <p className="text-red-500 mt-4">{error}</p>}

                {certificate && (
                    <div className="mt-6 space-y-4">
                        <h3 className="text-lg font-semibold">
                            {certificate.name}
                        </h3>
                        <p>Issue Date: {certificate.issueDate}</p>
                        <div className="space-y-2">
                            <a
                                href={certificate.blockExplorerLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-500 hover:underline"
                            >
                                View on Block Explorer{' '}
                                <ExternalLink className="ml-1 h-4 w-4" />
                            </a>
                            <a
                                href={certificate.openSeaLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-500 hover:underline"
                            >
                                View on OpenSea{' '}
                                <ExternalLink className="ml-1 h-4 w-4" />
                            </a>
                        </div>
                        <div className="mt-4">
                            <img
                                src={certificate.imageUrl}
                                alt={certificate.name}
                                className="max-w-full h-auto rounded-lg shadow-md"
                            />
                            {/* <Button onClick={handleDownload} className="mt-2">
                                <Download className="mr-2 h-4 w-4" /> Download
                                Certificate
                            </Button> */}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
