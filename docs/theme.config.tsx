import React, { useEffect, useState } from 'react';
import { DocsThemeConfig, ThemeSwitch } from 'nextra-theme-docs';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

const config: DocsThemeConfig = {
  logo: (
    <span>
      <Logo />
      <style jsx>{`
        span {
          width: 175px;
          height: auto;
          display: flex;
          justify-content: center;
          padding: 0.5rem 0.5rem 0.5rem 0;
          mask-image: linear-gradient(60deg, black 25%, rgba(0, 0, 0, 0.2) 50%, black 75%);
          mask-size: 400%;
          mask-position: 0%;
        }
        span:hover {
          mask-position: 100%;
          transition: mask-position 1s ease, -webkit-mask-position 1s ease;
        }
      `}</style>
    </span>
  ),
  project: {
    link: 'https://github.com/platypusrex/react-form-ally',
  },
  docsRepositoryBase: 'https://github.com/platypusrex/react-form-ally',
  navbar: {
    extraContent: <ThemeSwitch />,
  },
  gitTimestamp({ timestamp }) {
    /* eslint-disable react-hooks/rules-of-hooks */
    const router = useRouter();
    const fullUrl = router.asPath === '/';
    const [dateString, setDateString] = useState(timestamp.toISOString());

    useEffect(() => {
      try {
        setDateString(
          timestamp.toLocaleDateString(navigator.language, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        );
      } catch (e) {
        console.error(e);
      }
    }, [timestamp]);
    /* eslint-enable react-hooks/rules-of-hooks */

    if (fullUrl) return null;

    return <>Last updated on {dateString}</>;
  },
  footer: {
    text: (
      <span className="footer-content">
        <Link href="/" className="footer-logo" style={{ display: 'contents' }}>
          <Logo />
        </Link>
        <span className="footer-copywrite">
          MIT {new Date().getFullYear()} ©{' '}
          <a href="https://github.com/platypusrex" target="_blank">
            platypusrex
          </a>
        </span>
        <style jsx>{`
          .footer-content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 150px;
          }

          .footer-logo {
            display: contents;
          }

          .footer-copywrite {
            font-weight: 600;
            font-size: 0.75rem;
          }

          .footer-copywrite a {
            color: #0074d9;
            text-decoration: underline;
          }
        `}</style>
      </span>
    ),
  },
  themeSwitch: {
    component: null,
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – React Form Ally',
    };
  },
};

export default config;
