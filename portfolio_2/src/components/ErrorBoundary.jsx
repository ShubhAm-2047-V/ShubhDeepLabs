import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="absolute inset-0 z-[-1] bg-dark-bg w-full h-full flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-slate-500 font-mono text-xs">3D Canvas context lost. Running 2D fallback mode.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
