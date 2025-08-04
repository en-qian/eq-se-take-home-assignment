const NotFound = () => {
  return (
    <div className="not-found-wrapper">
      <div className="not-found-container">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <span
          onClick={() => {
            window.location.href = '/';
          }}
        >
          Go to home
        </span>
      </div>
    </div>
  );
};

export default NotFound;
