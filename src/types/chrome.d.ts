
interface Window {
  chrome?: {
    storage?: {
      local: {
        get: (keys: string[] | null, callback: (result: any) => void) => void;
        set: (items: any, callback?: () => void) => void;
      };
    };
    runtime?: {
      sendMessage: (message: any, callback: (response: any) => void) => void;
      getURL: (path: string) => string;
    };
  };
}
