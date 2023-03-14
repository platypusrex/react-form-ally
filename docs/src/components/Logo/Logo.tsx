import React from 'react';
import Link from 'next/link';
// import Image from 'next/image';
// import { LogoSVG } from "@/components/Logo/LogoSVG";
// import logo from '../../../public/default.svg';
import { Logo2 } from "@/components/Logo/Logo2";

export const Logo: React.FC = () => {
  return (
    <>
      <Link href="/" title="Home" className="hover:opacity-85">
        {/*<LogoSVG />*/}
        <Logo2 />
        {/*<Image src={logo} alt="react-form-ally" width={200} />*/}
      </Link>
    </>
  );
}

export default Logo;
