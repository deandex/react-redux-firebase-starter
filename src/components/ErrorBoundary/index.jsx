import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error({ error, errorInfo });
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      // You can render any custom fallback UI
      return (
        <div className="container">
          <div className="mx-auto w-50">
            <div className="mt-5 alert alert-danger text-center" role="alert">
              <strong style={{ marginRight: 5 }}>Whoops!</strong>
              Looks like something went wrong.
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}
