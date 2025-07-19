const scriptUrl =
  "https://affiliate-marketing-ten.vercel.app/affiliateTrackingJavascript.js";

export default function FrameworkInstructions() {
  return (
    <div className="mt-6 space-y-6">
      <h3 className="text-lg font-semibold">
        How to install the tracking script
      </h3>

      <div>
        <h4 className="font-medium">Next.js</h4>
        <code className="block bg-muted p-2 rounded">
          {`<Script src="${scriptUrl}" strategy="afterInteractive" />`}
        </code>
      </div>

      <div>
        <h4 className="font-medium">React</h4>
        <code className="block bg-muted p-2 rounded">
          {`<script src="${scriptUrl}"></script>`}
        </code>
      </div>

      <div>
        <h4 className="font-medium">Vue</h4>
        <code className="block bg-muted p-2 rounded">
          {`<script src="${scriptUrl}"></script>`}
        </code>
      </div>

      <div>
        <h4 className="font-medium">Svelte / SvelteKit</h4>
        <code className="block bg-muted p-2 rounded">
          {`<script src="${scriptUrl}"></script>`}
        </code>
      </div>
    </div>
  );
}
