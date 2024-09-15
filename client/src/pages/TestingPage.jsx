import React from 'react';
import HeroFormSignUpForm from './Auth/HeroFormSignUpForm';
import { PersonalInfoForm, SetGoal } from '@/components';
import { Certificate } from '.';
import CertificateVerifier from './VerifyCertificate';
import CertificateGallery from './GetCertificates';

function TestingPage() {
    return (
        <>
            <div className="flex items-center justify-center grow">
                {/* <Certificate /> */}
                <CertificateVerifier />
                {/* <CertificateGallery /> */}
            </div>
        </>
    );
}

export default TestingPage;
