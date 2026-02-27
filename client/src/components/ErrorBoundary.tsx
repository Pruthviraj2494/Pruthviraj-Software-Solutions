import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Uncaught error in ErrorBoundary:', error, info)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md rounded-md bg-white p-6 shadow-md shadow-gray-200">
            <h1 className="mb-2 text-lg font-semibold text-gray-900">Something went wrong</h1>
            <p className="mb-4 text-sm text-gray-600">
              An unexpected error occurred. You can try reloading the page. If the problem persists, please contact
              support.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Reload
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

