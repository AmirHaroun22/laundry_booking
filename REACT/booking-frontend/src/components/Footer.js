import React from 'react';

function Footer() {
  return (
    <footer style={styles.footer}>
      <p>© {new Date().getFullYear()} Asasiya</p>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#f8f9fa',
    color: '#6c757d',
    padding: '1rem',
    textAlign: 'center',
    bottom: '0',
    left: '0',
    right: '0',
    fontSize: '0.9rem',
  },
};

export default Footer;