import loadingScreenGif from '@assets/loading-gif.gif';

const LoadingScreen = (prop: { isLoading: boolean }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        zIndex: 9999,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'var(--dark-background)',
        padding: '20px',
        transition: 'all .2s ease-out',
        opacity: prop.isLoading ? 1 : 0,
        pointerEvents: prop.isLoading ? 'auto' : 'none',
      }}
      className="loading-screen"
    >
      <img style={{ width: '100%', maxWidth: '30px' }} src={loadingScreenGif} />
    </div>
  );
};

export default LoadingScreen;
