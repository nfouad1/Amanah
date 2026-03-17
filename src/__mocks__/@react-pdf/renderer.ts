/**
 * Jest mock for @react-pdf/renderer
 * Used to avoid ESM transform issues in test environment.
 * The actual PDF generation is tested via integration tests.
 */

export const renderToBuffer = jest.fn().mockResolvedValue(Buffer.from('%PDF-1.4 mock'));
export const renderToStream = jest.fn();
export const renderToFile = jest.fn();
export const renderToString = jest.fn().mockResolvedValue('<pdf>mock</pdf>');

export const Document = 'Document';
export const Page = 'Page';
export const View = 'View';
export const Text = 'Text';
export const Image = 'Image';
export const Link = 'Link';
export const Note = 'Note';
export const Canvas = 'Canvas';
export const StyleSheet = {
  create: (styles: Record<string, object>) => styles,
};
export const Font = {
  register: jest.fn(),
  load: jest.fn(),
};
export const PDFViewer = 'PDFViewer';
export const PDFDownloadLink = 'PDFDownloadLink';
export const BlobProvider = 'BlobProvider';
export const usePDF = jest.fn(() => [{ loading: false, blob: null, url: null, error: null }, jest.fn()]);
