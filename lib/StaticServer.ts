import { readFile } from "fs";
import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { extname, resolve as resolvePath } from "path";

/** Promisified wrapper of fs.readFile */
function read(filename: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    readFile(filename, (err, data) => err ? reject(err) : resolve(data));
  });
}

/** Simple static file server */
export class StaticServer {

  /** File extensions mapped to MIME types */
  private mimeTypes: Map<string, string> = new Map([
    [".html", "text/html"],
    [".js", "text/javascript"],
    [".css", "text/css"],
    [".json", "application/json"],
    [".png", "image/png"],
    [".jpg", "image/jpg"],
    [".wav", "audio/wav"],
    [".mp3", "audio/mp3"],
  ]);

  /** HTTP server */
  private server: Server;

  /** Root path of static resources to be served */
  private root: string;

  constructor(root: string) {
    this.root = root;
    this.server = createServer((req, res) => this.handleRequest(req, res));
  }

  /** Map a file extension to a MIME type */
  public setMIMEType(extension: string, contentType: string) {
    this.mimeTypes.set(extension, contentType);
  }

  /** Start listening for incoming messages */
  public listen(port: number) {
    this.server.listen(port);
    console.info(`Server listening on port ${port}`);
  }

  /** Handle incoming message */
  private async handleRequest(request: IncomingMessage, response: ServerResponse) {
    // Massage incoming URL
    let url = "index.html";
    if (request.url !== undefined && request.url !== "/") {
      url = request.url;
    }

    // Resolve filename relative to static root
    const filename = resolvePath(this.root, url);

    // Serve file contents
    try {
      const data = await read(filename);
      response.writeHead(200, {
        "Content-Type": this.getContentType(filename),
      });
      response.end(data, "utf-8");
    } catch (e) {
      if (e.code === "ENOENT") {
        // File not found
        response.writeHead(404);
        response.end(`NOT FOUND: ${url}`);
      } else {
        // An unexpected error occurred
        response.writeHead(500);
        response.end(`ERROR: ${e.message}`);
      }
    }
  }

  /** Infer content type from filename */
  private getContentType(filename: string): string {
    const ext = extname(filename);
    const contentType = this.mimeTypes.get(ext);
    if (contentType !== undefined) {
      return contentType;
    } else {
      return "application/octet-stream";
    }
  }

}
