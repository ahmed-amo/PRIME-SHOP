import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  message?: string;
}

/**
 * Catches render errors in child trees so one section cannot blank the whole app.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo): void {
    /* Error is surfaced in UI; integrate logging service here if needed */
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center"
          role="alert"
        >
          <p className="text-sm font-medium text-destructive">
            {this.props.fallbackTitle ?? 'Something went wrong in this section.'}
          </p>
          {this.state.message ? (
            <p className="mt-2 text-xs text-muted-foreground break-all">{this.state.message}</p>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => this.setState({ hasError: false, message: undefined })}
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
