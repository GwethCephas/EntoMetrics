import { Fragment } from "react";

const PLACEHOLDER_PATTERN = /(\[(?:PLACEHOLDER|PHOTO|LINKEDIN|LEGAL REVIEW)[^\]]*\])/g;

/**
 * Renders plain text, highlighting bracketed placeholders such as
 * "[PLACEHOLDER — CONFIRM WITH CLIENT: …]" so they stay visible until replaced.
 */
export function RichText({ text }: { text: string }) {
  const parts = text.split(PLACEHOLDER_PATTERN);
  return (
    <>
      {parts.map((part, index) =>
        isPlaceholder(part) ? (
          <span key={index} className="placeholder" data-placeholder>
            {part}
          </span>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}

function isPlaceholder(part: string) {
  return /^\[(?:PLACEHOLDER|PHOTO|LINKEDIN|LEGAL REVIEW)/.test(part);
}
