
import React, { Component, ErrorInfo, ReactNode } from 'react';
import ErrorFallback from '@/components/common/ErrorFallback';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class AuthErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Mark body with error state when any error occurs
    document.body.setAttribute('data-auth-error', 'true');
    document.body.setAttribute('data-content-error', 'true');
    
    return { 
      hasError: true, 
      error
    };
  }

  componentDidMount() {
    // Set a safety timeout to mark content as ready even if children have issues
    document.body.setAttribute('data-auth-safety', 'true');
    document.body.setAttribute('data-content-ready', 'true');
    document.documentElement.classList.add('content-ready');
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging
    console.error('[AuthErrorBoundary] Uncaught error:', error);
    console.error('[AuthErrorBoundary] Component stack:', errorInfo.componentStack);
    
    // Update state to save errorInfo
    this.setState({ errorInfo });
  }
  
  handleRetry = () => {
    // Reset error state
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null
    });
    
    // Remove error markers
    document.body.removeAttribute('data-auth-error');
    document.body.removeAttribute('data-error-message');
    document.body.removeAttribute('data-content-error');
    
    // Force content detection
    document.body.setAttribute('data-auth-retry', 'true');
    document.body.setAttribute('data-content-ready', 'true');
  };

  render() {
    // First attempt at showing error UI
    if (this.state.hasError) {
      return (
        <div 
          data-testid="auth-error" 
          data-content-ready="true" 
          className="auth-error-boundary"
          style={{ opacity: 1, visibility: 'visible' }} // Force visibility
        >
          <ErrorFallback
            title="Authentication Error"
            message="We're having trouble with the authentication page. Please try again or refresh the page."
            error={this.state.error}
            onRetry={this.handleRetry}
            showDetail={process.env.NODE_ENV !== 'production'}
          />
        </div>
      );
    }

    // Return children in a wrapper div to ensure visibility
    return (
      <div className="auth-error-boundary-content" data-auth-wrapper="active">
        {this.props.children}
      </div>
    );
  }
}

export default AuthErrorBoundary;
