class SecureIframeCommunicator {
  private allowedOrigins: Set<string>;
  private messageHandlers: Map<string, Set<(data: any) => void>> = new Map();

  constructor(allowedDomains: string[]) {
    this.allowedOrigins = new Set(
      allowedDomains.map(domain => `https://${domain}`)
    );
  }

  public registerIframe(id: string, iframe: HTMLIFrameElement): void {
    if (!this.messageHandlers.has(id)) {
      this.messageHandlers.set(id, new Set());
    }
  }

  public addMessageHandler(
    id: string, 
    handler: (data: any) => void
  ): () => void {
    if (!this.messageHandlers.has(id)) {
      this.messageHandlers.set(id, new Set());
    }
    
    const handlers = this.messageHandlers.get(id)!;
    handlers.add(handler);

    // Return cleanup function
    return () => {
      handlers.delete(handler);
    };
  }

  public sendMessage(
    iframe: HTMLIFrameElement, 
    message: any, 
    targetOrigin: string
  ): void {
    if (!this.allowedOrigins.has(targetOrigin)) {
      console.error(`Untrusted origin: ${targetOrigin}`);
      return;
    }

    if (iframe.contentWindow) {
      iframe.contentWindow.postMessage(message, targetOrigin);
    }
  }

  public initializeListener(): () => void {
    const handler = (event: MessageEvent) => {
      if (!this.allowedOrigins.has(event.origin)) {
        return; // Ignore messages from untrusted origins
      }

      // Process trusted message
      // You can implement specific message routing here
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }
}

export const iframeCommunicator = new SecureIframeCommunicator([
  'chat.quazfenton.xyz',
  'github.com',
  'huggingface.co'
]);