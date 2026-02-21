import React from 'react';
import { Button, ConfigProvider } from 'antd';
import styles from './Nav.module.css';

const theme = {
  token: {
    colorPrimary: '#2563eb',
    borderRadius: 8,
    fontFamily: 'inherit',
  },
};

export default function Nav() {
  return (
    <ConfigProvider theme={theme}>
      <header className={styles['nav-header']}>
        <div className={styles['nav-inner']}>
          <a href="#home" aria-label="Go to home" className={styles['nav-logo-link']}>
            <span className={styles['brand-logo']} role="img" aria-label="Vedana brand">
              <span className={styles['brand-icon']}></span>
              <span>Vedana</span>
            </span>
          </a>
          <nav className={styles['nav-links']}>
            <a href="#problem">Problem</a>
            <a href="#demo">Demo</a>
            <a href="#methodology">Methodology</a>
            <a href="#faq">FAQ</a>
            <Button type="primary" shape="round" href="#signup" size="middle">
              Get started
            </Button>
          </nav>
          <button className={styles['nav-menu-toggle']} aria-label="Open menu">Menu</button>
        </div>
      </header>
    </ConfigProvider>
  );
}
