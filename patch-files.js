const fs = require('fs');
const path = require('path');

function patchJpgToPng() {
  const filepath = path.join(__dirname, 'src/app/tools/jpg-to-png/JpgToPngClient.tsx');
  let content = fs.readFileSync(filepath, 'utf8');

  // Insert Modals logic if not present
  if (!content.includes('DownloadAdModal')) {
    content = content.replace(
      'import ToolLayout from "@/components/ToolLayout";',
      'import ToolLayout from "@/components/ToolLayout";\nimport DownloadAdModal from "@/components/DownloadAdModal";'
    );
    
    // Add state variables
    content = content.replace(
      'const fileInputRef = useRef<HTMLInputElement>(null);',
      `const fileInputRef = useRef<HTMLInputElement>(null);\n\n  // Ad Intercept State\n  const [isAdModalOpen, setIsAdModalOpen] = useState(false);\n  const [pendingDownloadAction, setPendingDownloadAction] = useState<(() => void) | null>(null);\n  const [adModalFileName, setAdModalFileName] = useState("");`
    );

    // Replace downloadAll function
    content = content.replace(
      /const downloadAll = \(\) => \{\s+images\.forEach\(\(img\) => \{\s+if \(img\.convertedUrl\) \{\s+const link = document\.createElement\("a"\);\s+link\.href = img\.convertedUrl;\s+link\.download = `\$\{img\.name\}\.png`;\s+link\.click\(\);\s+\}\s+\}\);\s+\};/,
      `const downloadAll = () => {
    setAdModalFileName(\`\${images.filter(i => i.status === "completed").length} converted files\`);
    setPendingDownloadAction(() => () => {
      images.forEach((img) => {
        if (img.convertedUrl) {
          const link = document.createElement("a");
          link.href = img.convertedUrl;
          link.download = \`\${img.name}-cosmoxhub.png\`;
          link.click();
        }
      });
    });
    setIsAdModalOpen(true);
  };

  const triggerDownloadSingle = (img: ImageFile) => {
    setAdModalFileName(\`\${img.name}-cosmoxhub.png\`);
    setPendingDownloadAction(() => () => {
      const link = document.createElement("a");
      link.href = img.convertedUrl!;
      link.download = \`\${img.name}-cosmoxhub.png\`;
      link.click();
    });
    setIsAdModalOpen(true);
  };`
    );

    // Update single download trigger
    content = content.replace(
      /onClick=\{.*?const link = document\.createElement\("a"\);\s+link\.href = img\.convertedUrl!;\s+link\.download = `\$\{img\.name\}\.png`;\s+link\.click\(\);\s+\}\}/,
      `onClick={() => triggerDownloadSingle(img)}`
    );

    // Add Modal to JSX before </ToolLayout>
    content = content.replace(
      '      </ToolLayout>',
      `      <DownloadAdModal 
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        onComplete={() => {
          if (pendingDownloadAction) {
            pendingDownloadAction();
            setPendingDownloadAction(null);
          }
        }}
        fileName={adModalFileName}
      />
    </ToolLayout>`
    );

    fs.writeFileSync(filepath, content);
    console.log("Patched JpgToPngClient.tsx");
  } else {
    console.log("JpgToPngClient.tsx already patched?");
  }
}

function patchPngToJpg() {
  const filepath = path.join(__dirname, 'src/app/tools/png-to-jpg/PngToJpgClient.tsx');
  let content = fs.readFileSync(filepath, 'utf8');

  // Insert Modals logic if not present
  if (!content.includes('DownloadAdModal')) {
    content = content.replace(
      'import ToolLayout from "@/components/ToolLayout";',
      'import ToolLayout from "@/components/ToolLayout";\nimport DownloadAdModal from "@/components/DownloadAdModal";'
    );
    
    // Add state variables
    content = content.replace(
      'const fileInputRef = useRef<HTMLInputElement>(null);',
      `const fileInputRef = useRef<HTMLInputElement>(null);\n\n  // Ad Intercept State\n  const [isAdModalOpen, setIsAdModalOpen] = useState(false);\n  const [pendingDownloadAction, setPendingDownloadAction] = useState<(() => void) | null>(null);\n  const [adModalFileName, setAdModalFileName] = useState("");`
    );

    // Replace downloadAll function
    content = content.replace(
      /const downloadAll = \(\) => \{\s+images\.forEach\(\(img\) => \{\s+if \(img\.convertedUrl\) \{\s+const link = document\.createElement\("a"\);\s+link\.href = img\.convertedUrl;\s+link\.download = `\$\{img\.name\}\.jpg`;\s+link\.click\(\);\s+\}\s+\}\);\s+\};/,
      `const downloadAll = () => {
    setAdModalFileName(\`\${images.filter(i => i.status === "completed").length} converted files\`);
    setPendingDownloadAction(() => () => {
      images.forEach((img) => {
        if (img.convertedUrl) {
          const link = document.createElement("a");
          link.href = img.convertedUrl;
          link.download = \`\${img.name}-cosmoxhub.jpg\`;
          link.click();
        }
      });
    });
    setIsAdModalOpen(true);
  };

  const triggerDownloadSingle = (img: ImageFile) => {
    setAdModalFileName(\`\${img.name}-cosmoxhub.jpg\`);
    setPendingDownloadAction(() => () => {
      const link = document.createElement("a");
      link.href = img.convertedUrl!;
      link.download = \`\${img.name}-cosmoxhub.jpg\`;
      link.click();
    });
    setIsAdModalOpen(true);
  };`
    );

    // Update single download trigger
    content = content.replace(
      /onClick=\{.*?const link = document\.createElement\("a"\);\s+link\.href = img\.convertedUrl!;\s+link\.download = `\$\{img\.name\}\.jpg`;\s+link\.click\(\);\s+\}\}/,
      `onClick={() => triggerDownloadSingle(img)}`
    );

    // Add Modal to JSX before </ToolLayout>
    content = content.replace(
      '      </ToolLayout>',
      `      <DownloadAdModal 
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        onComplete={() => {
          if (pendingDownloadAction) {
            pendingDownloadAction();
            setPendingDownloadAction(null);
          }
        }}
        fileName={adModalFileName}
      />
    </ToolLayout>`
    );

    fs.writeFileSync(filepath, content);
    console.log("Patched PngToJpgClient.tsx");
  } else {
    console.log("PngToJpgClient.tsx already patched?");
  }
}

function patchImageUpscaler() {
  const filepath = path.join(__dirname, 'src/app/tools/image-upscaler/ImageUpscalerClient.tsx');
  let content = fs.readFileSync(filepath, 'utf8');

  // Insert Modals logic if not present
  if (!content.includes('DownloadAdModal')) {
    content = content.replace(
      'import ToolLayout from "@/components/ToolLayout";',
      'import ToolLayout from "@/components/ToolLayout";\nimport DownloadAdModal from "@/components/DownloadAdModal";'
    );
    
    // Add state variables
    content = content.replace(
      'const [stabilityMode, setStabilityMode] = useState(false);\n  const fileInputRef = useRef<HTMLInputElement>(null);',
      `const [stabilityMode, setStabilityMode] = useState(false);\n  const fileInputRef = useRef<HTMLInputElement>(null);\n\n  // Ad Intercept State\n  const [isAdModalOpen, setIsAdModalOpen] = useState(false);\n  const [pendingDownloadAction, setPendingDownloadAction] = useState<(() => void) | null>(null);\n  const [adModalFileName, setAdModalFileName] = useState("");`
    );

    // Replace downloadOne function
    content = content.replace(
      /const downloadOne = \(f: UpscaleFile\) => \{\s+if \(!f\.result\) return;\s+const a = document\.createElement\("a"\);\s+a\.href = f\.result;\s+a\.download = `cosmox-\$\{scale\}x-\$\{f\.file\.name\.replace\(\/\\\\\.\[\^\/\.\]\+\$\/, ""\)\}\.\$\{format\}`;\s+a\.click\(\);\s+\};/,
      `const triggerDownloadSingle = (f: UpscaleFile) => {
    if (!f.result) return;
    const downloadName = \`cosmox-\${scale}x-\${f.file.name.replace(/\\.[^/.]+$/, "")}.\${format}\`;
    setAdModalFileName(downloadName);
    setPendingDownloadAction(() => () => {
      const a = document.createElement("a");
      a.href = f.result!;
      a.download = downloadName;
      a.click();
    });
    setIsAdModalOpen(true);
  };
  
  const downloadOne = (f: UpscaleFile) => triggerDownloadSingle(f);`
    );

    // Replace downloadAllZip trigger
    content = content.replace(
      `    a.click();
    URL.revokeObjectURL(a.href);
  };`,
      `    setAdModalFileName(\`\${completed.length} upscaled files (ZIP)\`);
    setPendingDownloadAction(() => () => {
      a.click();
      URL.revokeObjectURL(a.href);
    });
    setIsAdModalOpen(true);
  };`
    );

    // Add Modal to JSX before </ToolLayout>
    content = content.replace(
      '      </ToolLayout>',
      `      <DownloadAdModal 
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        onComplete={() => {
          if (pendingDownloadAction) {
            pendingDownloadAction();
            setPendingDownloadAction(null);
          }
        }}
        fileName={adModalFileName}
      />
    </ToolLayout>`
    );

    fs.writeFileSync(filepath, content);
    console.log("Patched ImageUpscalerClient.tsx");
  } else {
    console.log("ImageUpscalerClient.tsx already patched?");
  }
}

try {
  patchJpgToPng();
  patchPngToJpg();
  patchImageUpscaler();
} catch (e) {
  console.error("Error during patch:", e);
}
