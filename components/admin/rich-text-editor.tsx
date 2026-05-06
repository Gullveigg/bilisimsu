"use client";

import { useEffect, useRef } from "react";
import { Bold, Italic, List, ListOrdered, Pilcrow, Underline } from "lucide-react";
import { cn, convertPlainTextToHtml } from "@/lib/utils";

type RichTextEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

type ToolbarButtonProps = {
  label: string;
  onMouseDown: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
};

function ToolbarButton({ label, onMouseDown, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onMouseDown={onMouseDown}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-white text-[var(--foreground)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ label, value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;
    const nextHtml = convertPlainTextToHtml(value);
    if (editorRef.current.innerHTML !== nextHtml) {
      editorRef.current.innerHTML = nextHtml;
    }
  }, [value]);

  function runCommand(command: string, commandValue?: string) {
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current?.innerHTML || "");
  }

  function handleInput() {
    onChange(editorRef.current?.innerHTML || "");
  }

  return (
    <label className="lg:col-span-2">
      <span className="mb-2 block text-sm font-medium text-[var(--foreground)]">{label}</span>
      <div className="overflow-hidden rounded-[24px] border border-[var(--border)] bg-white">
        <div className="flex flex-wrap gap-2 border-b border-[var(--border)] bg-[var(--secondary)]/35 p-3">
          <ToolbarButton label="Paragraf" onMouseDown={(event) => { event.preventDefault(); runCommand("formatBlock", "p"); }}>
            <Pilcrow size={16} />
          </ToolbarButton>
          <ToolbarButton label="Büyük Başlık" onMouseDown={(event) => { event.preventDefault(); runCommand("formatBlock", "h1"); }}>
            <span className="text-sm font-bold">H1</span>
          </ToolbarButton>
          <ToolbarButton label="Başlık" onMouseDown={(event) => { event.preventDefault(); runCommand("formatBlock", "h2"); }}>
            <span className="text-sm font-bold">H2</span>
          </ToolbarButton>
          <ToolbarButton label="Alt Başlık" onMouseDown={(event) => { event.preventDefault(); runCommand("formatBlock", "h3"); }}>
            <span className="text-sm font-bold">H3</span>
          </ToolbarButton>
          <ToolbarButton label="Kalın" onMouseDown={(event) => { event.preventDefault(); runCommand("bold"); }}>
            <Bold size={16} />
          </ToolbarButton>
          <ToolbarButton label="İtalik" onMouseDown={(event) => { event.preventDefault(); runCommand("italic"); }}>
            <Italic size={16} />
          </ToolbarButton>
          <ToolbarButton label="Altı Çizili" onMouseDown={(event) => { event.preventDefault(); runCommand("underline"); }}>
            <Underline size={16} />
          </ToolbarButton>
          <ToolbarButton label="Madde Listesi" onMouseDown={(event) => { event.preventDefault(); runCommand("insertUnorderedList"); }}>
            <List size={16} />
          </ToolbarButton>
          <ToolbarButton label="Numaralı Liste" onMouseDown={(event) => { event.preventDefault(); runCommand("insertOrderedList"); }}>
            <ListOrdered size={16} />
          </ToolbarButton>
          <label className="flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-[var(--muted)]">
            Renk
            <input
              type="color"
              className="h-6 w-6 cursor-pointer border-0 bg-transparent p-0"
              defaultValue="#0c1d30"
              onChange={(event) => runCommand("foreColor", event.target.value)}
            />
          </label>
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          className={cn(
            "rich-content min-h-[320px] px-5 py-4 text-[var(--foreground)] outline-none",
            "[&:empty:before]:pointer-events-none [&:empty:before]:text-[var(--muted)] [&:empty:before]:content-['İçeriği_burada_biçimlendirebilirsiniz']"
          )}
        />
      </div>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Başlık, madde listesi, kalın yazı ve renk seçimi ile kullanıcı dostu içerik hazırlayabilirsiniz.
      </p>
    </label>
  );
}
