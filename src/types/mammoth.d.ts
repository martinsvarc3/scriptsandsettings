declare module 'mammoth' {
  interface Options {
    styleMap?: string[];
  }
  
  interface Result {
    value: string;
    messages: Array<{
      type: string;
      message: string;
      // Add other properties as needed
    }>;
  }

  function convertToHtml(input: { arrayBuffer: ArrayBuffer }, options?: Options): Promise<Result>;
}
