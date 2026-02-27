'use client';

export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ color: 'green' }}>✅ App is Working!</h1>
      <p>If you see this page, your Next.js app is running correctly.</p>
      <p>The blank screen on the home page might be due to:</p>
      <ul>
        <li>JavaScript error in browser console</li>
        <li>localStorage issue</li>
        <li>CSS not loading</li>
      </ul>
      <h2>Next Steps:</h2>
      <ol>
        <li>Open browser DevTools (F12)</li>
        <li>Check the Console tab for errors</li>
        <li>Go back to <a href="/" style={{ color: 'blue' }}>home page</a></li>
        <li>Look for any red error messages</li>
      </ol>
    </div>
  );
}
