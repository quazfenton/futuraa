import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error | null }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Here you could log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || DefaultErrorFallback;
      return <Fallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error: Error | null }> = ({ error }) => (
  <div className="void-panel p-8 text-center">
    <h2 className="text-xl font-mono text-electric-cyan mb-4">Something went wrong</h2>
    <p className="text-steel mb-4">
      {error?.message || 'An unexpected error occurred'}
    </p>
    <button
      className="bg-electric-cyan/20 hover:bg-electric-cyan/30 px-4 py-2 rounded-sm font-mono"
      onClick={() => window.location.reload()}
    >
      Reload Application
    </button>
  </div>
);

export default ErrorBoundary;